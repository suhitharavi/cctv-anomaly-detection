import { useState, useEffect } from "react";
import type { SystemStatus } from "@/types";
import { getSystemStatus } from "@/utils/api";

export function useSystemStatus() {
  const [status, setStatus] = useState<SystemStatus>({
    backend_connected: false,
    model_status: "idle",
    fps: 0,
    quantum_layer: "off",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getSystemStatus();
        setStatus(data);
      } catch (error) {
        console.error("Failed to fetch system status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return { status, loading };
}
