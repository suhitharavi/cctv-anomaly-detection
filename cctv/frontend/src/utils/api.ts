import type { DetectionResult, SystemStatus, Alert } from "@/types";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export function getApiBase(): string {
  return API_BASE;
}

export async function getSystemStatus(): Promise<SystemStatus> {
  try {
    const res = await fetch(`${API_BASE}/`);
    if (!res.ok) throw new Error("Failed to fetch status");
    const data = await res.json();
    return {
      backend_connected: data.status === "active",
      model_status: "running",
      fps: 30,
      quantum_layer: "shadow",
    };
  } catch (error) {
    return {
      backend_connected: false,
      model_status: "idle",
      fps: 0,
      quantum_layer: "off",
    };
  }
}

/** Upload video file for prediction (single-shot REST API) */
export async function predictVideo(
  file: File,
  onResult: (result: DetectionResult) => void,
  onDone?: () => void,
  onError?: (err: Error) => void,
  onStarted?: () => void,
  signal?: AbortSignal
): Promise<void> {
  onStarted?.();

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      body: formData,
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      throw new Error(errorData.error || `Prediction failed: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("ReadableStream not supported");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const data = JSON.parse(line);

          if (data.type === "detection") {
            onResult({
              label: (data.label === "NormalVideos" ? "Normal" :
                data.label === "RoadAccidents" ? "Road Accidents" : data.label) as any,
              confidence: data.confidence,
              is_anomaly: true,
              timestamp: data.time,
              // Special marker for streaming updates
              all_detections: [{ time: data.time, label: data.label, confidence: data.confidence }]
            });
          } else if (data.type === "summary") {
            onResult({
              label: (data.label === "NormalVideos" ? "Normal" :
                data.label === "RoadAccidents" ? "Road Accidents" : data.label) as any,
              confidence: data.confidence,
              is_anomaly: data.is_anomaly,
              timestamp: data.timestamp,
            });
          } else if (data.type === "error") {
            throw new Error(data.message);
          }
        } catch (e) {
          console.error("Error parsing NDJSON line:", e);
        }
      }
    }

    onDone?.();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return;
    }
    onError?.(error instanceof Error ? error : new Error(String(error)));
  }
}

export async function detectFrame(): Promise<{ detection_result: DetectionResult; session_id: string }> {
  throw new Error("Frame-by-frame detection not supported by current backend");
}

export async function getAlerts(): Promise<Alert[]> {
  // Returns empty currently as backend doesn't persist alerts
  return [];
}
