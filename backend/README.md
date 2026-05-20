# Backend – CCTV Anomaly Detection

Flask API for the hybrid classical–quantum anomaly detection system.

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # Linux/macOS
pip install -r requirements.txt
```

## Model

- Place **`best_hybrid_ucfcrime.pt`** (from the training notebook) in the `backend/` folder.
- If the file is missing, the server still runs and returns **mock** detection results.

## Run

```bash
python app.py
```

Server: `http://localhost:5000`. The app runs with **eventlet** so WebSockets work.

## WebSocket (video detection stream)

| Path | Description |
|------|-------------|
| **WS** | `/ws/detection` | Connect, send video as binary chunks, then text `VIDEO_END`. Server sends `{"type":"started"}`, then `{"type":"result", ...}` per clip, then `{"type":"done"}`. |

The frontend uses this WebSocket for file upload + streaming detection results (replaces HTTP streaming).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/status` | System status (backend connected, model loaded, fps, quantum layer). |
| GET | `/api/alerts` | List of anomaly alerts. |
| POST | `/api/process-video` | Upload video (multipart). Response: NDJSON stream. (Alternative to WebSocket.) |
| POST | `/api/process-video-json` | Same as above but response is a single JSON array when done. |
| POST | `/api/detect-frame` | Single frame (multipart `frame` or JSON `{"image": "<base64>"}`). Optional query `session_id`. Buffers 16 frames per session, then returns detection. |

## Frontend

Set `VITE_API_BASE=http://localhost:5000` (or your backend URL). The dashboard uses **WebSocket** `/ws/detection` for video upload and streaming detection results, and HTTP for status, alerts, and camera frame detection.
