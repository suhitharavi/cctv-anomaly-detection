import { useState, useEffect, useCallback, useRef } from "react";
import { VideoInput } from "@/components/VideoInput";
import { VideoDisplay } from "@/components/VideoDisplay";
import { DetectionResult } from "@/components/DetectionResult";
import { AlertsPanel } from "@/components/AlertsPanel";
import { AnomalyTimeline } from "@/components/AnomalyTimeline";
import { SystemStatus } from "@/components/SystemStatus";
import { useVideoStream } from "@/hooks/useVideoStream";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import { generateMockDetection, mockAlerts } from "@/utils/mockData";
import { predictVideo, getAlerts } from "@/utils/api";
import type { Alert, DetectionResult as DetectionResultType } from "@/types";



export function Dashboard() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] =
    useState<DetectionResultType | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [processingVideoStarted, setProcessingVideoStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const videoStream = useVideoStream();
  const { status } = useSystemStatus();

  const fileProcessingRef = useRef(false);
  const fileAbortControllerRef = useRef<AbortController | null>(null);
  const fileRunIdRef = useRef<number>(0);

  const addAlertFromResult = useCallback((result: DetectionResultType) => {
    if (result.is_anomaly) {
      setAlerts((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          time: result.timestamp,
          type: result.label,
          severity: "anomaly",
        },
      ]);
    }
  }, []);

  // Backend connected: use real API; otherwise mock
  const backendConnected = status.backend_connected;

  // File: stream video to backend when Start Detection + file
  useEffect(() => {
    if (
      !isDetecting ||
      !backendConnected ||
      videoStream.source !== "file" ||
      !videoStream.videoFile
    ) {
      fileProcessingRef.current = false;
      return;
    }
    if (fileProcessingRef.current) return;
    fileProcessingRef.current = true;
    setProcessingVideoStarted(false);
    fileAbortControllerRef.current?.abort();
    const controller = new AbortController();
    fileAbortControllerRef.current = controller;
    const runId = ++fileRunIdRef.current;
    predictVideo(
      videoStream.videoFile,
      (result) => {
        if (fileRunIdRef.current !== runId) return;

        setDetectionResult((prev) => {
          if (!prev) return result;

          // Merge and deduplicate by timestamp string
          const existingMap = new Map((prev.all_detections || []).map(d => [d.time, d]));
          (result.all_detections || []).forEach(d => {
            existingMap.set(d.time, d);
          });

          const combinedDetections = Array.from(existingMap.values())
            .sort((a, b) => a.time.localeCompare(b.time));

          return {
            ...result,
            all_detections: combinedDetections
          };
        });

        // Add alerts for new unique detections
        if (result.all_detections && result.all_detections.length > 0) {
          setAlerts((prev) => {
            const existingTimes = new Set(prev.map(a => a.time));
            const uniqueNewAlerts: Alert[] = result.all_detections!
              .filter(d => !existingTimes.has(d.time))
              .map((d, idx) => ({
                id: `${Date.now()}-${idx}-${Math.random()}`,
                time: d.time,
                type: d.label as any,
                severity: "anomaly"
              }));
            return [...prev, ...uniqueNewAlerts];
          });
        }
      },
      () => {
        fileProcessingRef.current = false;
        setIsProcessing(false);
      },
      (err) => {
        console.error("Prediction error:", err);
        fileProcessingRef.current = false;
        setIsProcessing(false);
      },
      () => {
        if (fileRunIdRef.current !== runId) return;
        setProcessingVideoStarted(true);
        setIsProcessing(true);
      },
      controller.signal
    );
  }, [
    isDetecting,
    backendConnected,
    videoStream.source,
    videoStream.videoFile,
    addAlertFromResult,
  ]);

  // Camera logic removed as backend only supports file upload currently

  // Mock detection when backend is not available
  useEffect(() => {
    if (isDetecting && !backendConnected) {
      const interval = setInterval(() => {
        const mockResult = generateMockDetection();
        setDetectionResult(mockResult);
        addAlertFromResult(mockResult);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isDetecting, backendConnected, addAlertFromResult]);

  // Fetch alerts from backend when connected
  useEffect(() => {
    if (backendConnected) {
      getAlerts().then(setAlerts).catch(() => { });
    }
  }, [backendConnected]);

  const handleStartDetection = useCallback(() => {
    setAlerts([]); // New run: start with clean timeline and alerts
    setDetectionResult(null);
    setIsDetecting(true);
  }, []);

  const handleStopDetection = useCallback(() => {
    fileRunIdRef.current = 0; // Ignore any in-flight results from previous run
    fileAbortControllerRef.current?.abort(); // Stop reading stream; backend may still run until request is dropped
    fileAbortControllerRef.current = null;
    setAlerts([]);
    setDetectionResult(null);
    setProcessingVideoStarted(false);
    setIsDetecting(false);
    videoStream.stop(); // Clear video so upload/camera buttons show again
  }, [videoStream.stop]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            CCTV Anomaly Detection System
          </h1>
          <p className="text-muted-foreground">
            Real-time surveillance with Hybrid Classical-Quantum AI
          </p>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Detection & Alerts (moved left) */}
          <div className="space-y-4">
            <DetectionResult
              result={detectionResult}
              isProcessingVideo={
                isDetecting &&
                backendConnected &&
                videoStream.source === "file" &&
                processingVideoStarted
              }
            />
            <AlertsPanel alerts={alerts} />
          </div>

          {/* Right Column: Video (moved right) */}
          <div className="space-y-4">
            <VideoDisplay
              source={videoStream.source}
              videoUrl={videoStream.videoUrl}
              videoRef={videoStream.videoRef}
              isDetecting={isDetecting}
              isProcessing={isProcessing}
              videoFileName={videoStream.videoFile?.name ?? null}
            />
            <VideoInput
              source={videoStream.source}
              videoFile={videoStream.videoFile}
              onFileUpload={videoStream.handleFileUpload}
              onStartCamera={videoStream.startCamera}
              onStop={videoStream.stop}
              onStartDetection={handleStartDetection}
              onStopDetection={handleStopDetection}
              isDetecting={isDetecting}
            />
          </div>
        </div>

        {/* Bottom: Timeline & Status */}
        <div className="space-y-4">
          <AnomalyTimeline alerts={alerts} />
          <SystemStatus status={status} />
        </div>

        {/* Mock Mode Indicator: show when backend not reachable */}
        {!backendConnected && (
          <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            ⚠️ Using Mock Data (Backend not connected)
          </div>
        )}
      </div>
    </div>
  );
}
