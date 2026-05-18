import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Alert as AlertType } from "@/types";

interface AlertsPanelProps {
  alerts: AlertType[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const recentAlerts = alerts.slice(-10).reverse(); // Last 10, newest first

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Alerts</h3>
      <ScrollArea className="h-[300px]">
        {recentAlerts.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No alerts yet</p>
            <p className="text-sm mt-2">Alerts will appear here when anomalies are detected</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentAlerts.map((alert) => (
              <Alert
                key={alert.id}
                variant={alert.severity === "anomaly" ? "destructive" : "default"}
                className="py-2"
              >
                <div className="flex items-start gap-2">
                  {alert.severity === "anomaly" ? (
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500" />
                  )}
                  <AlertDescription className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{alert.type}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {alert.time}
                      </span>
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}
