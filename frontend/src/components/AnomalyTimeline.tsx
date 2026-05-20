import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import type { Alert } from "@/types";

interface AnomalyTimelineProps {
  alerts: Alert[];
}

export function AnomalyTimeline({ alerts }: AnomalyTimelineProps) {
  const anomalyAlerts = alerts.filter((alert) => alert.severity === "anomaly");

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        Anomaly Timeline
      </h3>
      {anomalyAlerts.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          <p>No anomalies detected yet</p>
          <p className="text-sm mt-2">Anomaly events will be logged here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {anomalyAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-mono text-sm">
                    {alert.time}
                  </TableCell>
                  <TableCell className="font-medium">{alert.type}</TableCell>
                  <TableCell>
                    <span className="text-destructive font-semibold">
                      Anomaly
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
