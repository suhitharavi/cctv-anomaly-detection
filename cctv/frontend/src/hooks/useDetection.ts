import { useState, useEffect, useRef } from "react";
import type { DetectionResult } from "@/types";
import { createDetectionWebSocket } from "@/utils/api";

export function useDetection(enabled: boolean) {
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    const ws = createDetectionWebSocket(
      (detectionResult) => {
        setResult(detectionResult);
        setIsConnected(true);
      },
      () => {
        setIsConnected(false);
      }
    );

    if (ws) {
      wsRef.current = ws;
      ws.onopen = () => setIsConnected(true);
      ws.onclose = () => setIsConnected(false);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [enabled]);

  return { result, isConnected };
}
