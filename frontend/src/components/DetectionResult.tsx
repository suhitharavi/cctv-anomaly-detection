import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { DetectionResult as DetectionResultType } from "@/types";

interface DetectionResultProps {
  result: DetectionResultType | null;
  /** True when backend has started processing a video file (waiting for first clip result). */
  isProcessingVideo?: boolean;
}

export function DetectionResult({ result, isProcessingVideo }: DetectionResultProps) {
  if (!result) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-primary">System Output Analysis</h3>
        <div className="text-center text-muted-foreground py-8">
          {isProcessingVideo ? (
            <>
              <p className="font-medium">Processing video…</p>
              <p className="text-sm mt-2">Analyzing frames for anomalies. This may take a while.</p>
            </>
          ) : (
            <>
              <p>Waiting for analysis...</p>
              <p className="text-sm mt-2">Upload a video to see real-time output</p>
            </>
          )}
        </div>
      </Card>
    );
  }

  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-primary">System Output Analysis</h3>
      <div className="space-y-6">
        {/* Anomaly Detection Alert */}
        <div className="space-y-2">
          <span className="text-sm font-medium flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary" />
            Anomaly Detection Alert
          </span>
          <div className="flex items-center gap-3 pl-3">
            {result.is_anomaly ? (
              <Badge variant="destructive" className="text-sm px-4 py-1.5 animate-pulse">
                <AlertTriangle className="mr-2 h-4 w-4" />
                ANOMALY DETECTED
              </Badge>
            ) : (
              <Badge className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-1.5">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                NORMAL (NON-VIOLENT)
              </Badge>
            )}
          </div>
        </div>

        {/* Classification Labels */}
        <div className="space-y-2">
          <span className="text-sm font-medium flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary" />
            Classification Label
          </span>
          <div className="pl-3">
            <span className="text-xl font-bold tracking-tight">{result.label}</span>
          </div>
        </div>

        {/* Confidence Scores */}
        <div className="space-y-2">
          <span className="text-sm font-medium flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary" />
            Confidence Score
          </span>
          <div className="pl-3 space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">Probability</span>
              <span className="text-sm font-bold">{confidencePercent}%</span>
            </div>
            <Progress value={confidencePercent} className="h-2" />
          </div>
        </div>

      </div>
    </Card>
  );
}
