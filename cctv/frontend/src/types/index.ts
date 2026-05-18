export type CrimeClass =
  | "Normal"
  | "Abuse"
  | "Arrest"
  | "Arson"
  | "Assault"
  | "Burglary"
  | "Explosion"
  | "Fighting"
  | "Road Accidents"
  | "Robbery"
  | "Shooting"
  | "Shoplifting"
  | "Stealing"
  | "Vandalism";

export interface DetectionResult {
  label: CrimeClass;
  confidence: number; // 0-1
  is_anomaly: boolean;
  timestamp: string; // "00:01:22" or ISO
  /** List of all anomalous detections in the video */
  all_detections?: { time: string; label: string; confidence: number }[];
  /** Set when streamed from backend (clip index in video). */
  clip_index?: number;
}

export interface Alert {
  id: string;
  time: string;
  type: CrimeClass;
  severity: "normal" | "anomaly";
}

export interface SystemStatus {
  backend_connected: boolean;
  model_status: "running" | "idle" | "error";
  fps?: number;
  quantum_layer?: "simulator" | "off" | "shadow";
}
