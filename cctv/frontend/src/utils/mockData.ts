import type { DetectionResult, Alert } from "@/types";

// Mock detection results for testing
export const mockDetectionResults: DetectionResult[] = [
  {
    label: "Normal",
    confidence: 0.95,
    is_anomaly: false,
    timestamp: "00:00:15",
  },
  {
    label: "Fighting",
    confidence: 0.92,
    is_anomaly: true,
    timestamp: "00:01:22",
  },
  {
    label: "Normal",
    confidence: 0.88,
    is_anomaly: false,
    timestamp: "00:02:10",
  },
  {
    label: "Shoplifting",
    confidence: 0.87,
    is_anomaly: true,
    timestamp: "00:02:45",
  },
  {
    label: "Robbery",
    confidence: 0.91,
    is_anomaly: true,
    timestamp: "00:03:30",
  },
];

// Mock alerts
export const mockAlerts: Alert[] = [
  {
    id: "1",
    time: "00:01:22",
    type: "Fighting",
    severity: "anomaly",
  },
  {
    id: "2",
    time: "00:02:45",
    type: "Shoplifting",
    severity: "anomaly",
  },
  {
    id: "3",
    time: "00:03:30",
    type: "Robbery",
    severity: "anomaly",
  },
];

// Generate random mock detection result
export function generateMockDetection(): DetectionResult {
  const crimeClasses: DetectionResult["label"][] = [
    "Normal",
    "Fighting",
    "Robbery",
    "Assault",
    "Shoplifting",
    "Burglary",
  ];
  const randomClass =
    crimeClasses[Math.floor(Math.random() * crimeClasses.length)];
  const isAnomaly = randomClass !== "Normal";
  const confidence = isAnomaly
    ? 0.75 + Math.random() * 0.2 // 75-95% for anomalies
    : 0.85 + Math.random() * 0.1; // 85-95% for normal

  const now = new Date();
  const timestamp = `${String(Math.floor(now.getSeconds() % 60)).padStart(
    2,
    "0"
  )}:${String(now.getMilliseconds()).padStart(3, "0").slice(0, 2)}`;

  return {
    label: randomClass,
    confidence,
    is_anomaly: isAnomaly,
    timestamp,
  };
}
