import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Server, Cpu, Zap } from "lucide-react";
import type { SystemStatus as SystemStatusType } from "@/types";

interface SystemStatusProps {
  status: SystemStatusType;
  loading?: boolean;
}

export function SystemStatus({ status, loading }: SystemStatusProps) {
  if (loading) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Loading status...</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">System Status</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Backend</div>
            <Badge
              variant={status.backend_connected ? "default" : "destructive"}
              className="mt-1"
            >
              {status.backend_connected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Model</div>
            <Badge
              variant={
                status.model_status === "running"
                  ? "default"
                  : status.model_status === "error"
                    ? "destructive"
                    : "secondary"
              }
              className="mt-1"
            >
              {status.model_status === "running"
                ? "Running"
                : status.model_status === "error"
                  ? "Error"
                  : "Idle"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">FPS</div>
            <div className="text-sm font-semibold mt-1">
              {status.fps ?? "--"}
            </div>
          </div>
        </div>

      </div>
    </Card>
  );
}
