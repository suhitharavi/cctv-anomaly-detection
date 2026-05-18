import os
import cv2
import numpy as np
import tensorflow as tf
import json
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import tempfile
import pennylane as qml
from datetime import timedelta

app = Flask(__name__)
CORS(app)

# Reconstruct and Load Architecture to handle Keras 2/3 compatibility issues
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.h5')

def build_model(num_classes=14):
    from tensorflow.keras.applications import ResNet50
    from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
    from tensorflow.keras.models import Model
    
    # Define the backbone (using same input shape as training)
    base_model = ResNet50(
        weights=None,  # Weights will be loaded from the H5 file
        include_top=False,
        input_shape=(224, 224, 3)
    )
    
    # Recreate the custom layers precisely
    x = GlobalAveragePooling2D()(base_model.output)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.5)(x)
    output = Dense(num_classes, activation='softmax')(x)
    
    # Assemble the model
    model = Model(inputs=base_model.input, outputs=output)
    return model

# Initialize architecture and load entire weights from H5 file
try:
    model = build_model()
    model.load_weights(MODEL_PATH)
    print("Model architecture reconstructed and weights loaded successfully.")
except Exception as e:
    print(f"Error loading model weights: {e}")
    # Handle possible weight-only file or full model file issues
    try:
        model = build_model()
        model.load_weights(MODEL_PATH, by_name=True, skip_mismatch=True)
        print("Model weights loaded with partial matches (by_name=True).")
    except Exception as e2:
        print(f"Failed all weight loading attempts: {e2}")
        raise e2

# Class names as provided in the user request
CLASS_NAMES = [
    'Abuse', 'Arrest', 'Arson', 'Assault', 'Burglary', 'Explosion', 
    'Fighting', 'NormalVideos', 'RoadAccidents', 'Robbery', 'Shooting', 
    'Shoplifting', 'Stealing', 'Vandalism'
]

# --- PennyLane Quantum Infrastructure ---
n_qubits = 4
dev = qml.device("default.qubit", wires=n_qubits)

@qml.qnode(dev)
def quantum_circuit(inputs):
    """Simple 4-qubit circuit for shadow processing."""
    for i in range(n_qubits):
        qml.RY(inputs[i] * np.pi, wires=i)
    for i in range(n_qubits - 1):
        qml.CNOT(wires=[i, i + 1])
    return [qml.expval(qml.PauliZ(i)) for i in range(n_qubits)]

def quantum_shadow_processing(classical_features):
    try:
        # Resize to match qubits using np.resize (handles any size mismatch)
        inputs = np.resize(classical_features, (n_qubits,))
        
        q_results = quantum_circuit(inputs)
        print(f"[Quantum Processing ] State: {q_results}")
        return q_results
    except Exception as e:
        print(f"[Quantum Processing] Error: {e}")
        return None

from tensorflow.keras.applications.resnet50 import preprocess_input

def preprocess_frame(frame):
    """Preprocess a single frame for the ResNet50 model using standard Keras preprocessing."""
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    frame = cv2.resize(frame, (224, 224))
    # ResNet50 preprocess_input expects 0-255 range images
    frame = preprocess_input(frame.astype(np.float32))
    return frame

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'status': 'active',
        'message': 'Backend is running. Use /predict for analysis.'
    })

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save video to a temporary file
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, file.filename)
    file.save(temp_path)

    def generate():
        cap = cv2.VideoCapture(temp_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        if fps <= 0: fps = 30
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        num_frames_to_extract = 30
        interval = max(1, total_frames // num_frames_to_extract)
        
        all_predictions = []
        
        try:
            for i in range(num_frames_to_extract):
                frame_idx = i * interval
                cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
                ret, frame = cap.read()
                if not ret: break
                
                processed_frame = preprocess_frame(frame)
                frame_input = np.expand_dims(processed_frame, axis=0)
                prediction = model.predict(frame_input)[0]
                all_predictions.append(prediction)
                
                class_idx = np.argmax(prediction)
                conf = float(prediction[class_idx])
                cat = CLASS_NAMES[class_idx]
                
                # Stream immediate detection if it's an anomaly
                if cat != "NormalVideos" and conf > 0.35:
                    sec = frame_idx / fps
                    ts = str(timedelta(seconds=round(sec)))
                    yield json.dumps({
                        "type": "detection",
                        "time": ts,
                        "label": cat,
                        "confidence": round(conf, 2)
                    }) + "\n"

            # Final Aggregate Summary
            if all_predictions:
                avg_preds = np.mean(all_predictions, axis=0)
                predicted_idx = np.argmax(avg_preds)
                final_conf = float(avg_preds[predicted_idx])
                final_label = CLASS_NAMES[predicted_idx]
                
                # Shadow Quantum Logic
                quantum_shadow_processing(avg_preds)
                
                # Threshold refinement
                normal_idx = CLASS_NAMES.index('NormalVideos')
                normal_score = avg_preds[normal_idx]
                if final_label != 'NormalVideos' and normal_score > 0.35:
                    final_label = 'NormalVideos'
                    final_conf = normal_score
                
                median_ts = str(timedelta(seconds=round((num_frames_to_extract // 2 * interval) / fps)))
                
                yield json.dumps({
                    "type": "summary",
                    "label": final_label,
                    "confidence": round(final_conf, 2),
                    "is_anomaly": final_label != "NormalVideos",
                    "timestamp": median_ts
                }) + "\n"
                
        except Exception as e:
            yield json.dumps({"type": "error", "message": str(e)}) + "\n"
        finally:
            cap.release()
            if os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except:
                    pass

    return Response(generate(), mimetype='application/x-ndjson')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
