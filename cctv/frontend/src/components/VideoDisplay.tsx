import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Video, Loader2 } from "lucide-react";
import type { useVideoStream } from "@/hooks/useVideoStream";

interface VideoDisplayProps {
  source: ReturnType<typeof useVideoStream>["source"];
  videoUrl: ReturnType<typeof useVideoStream>["videoUrl"];
  videoRef: ReturnType<typeof useVideoStream>["videoRef"];
  isDetecting: boolean;
  isProcessing?: boolean;
  /** Filename of uploaded video (e.g. "clip.mp4") for "Video uploaded" state */
  videoFileName?: string | null;
}

export function VideoDisplay({
  source,
  videoUrl,
  videoRef,
  isDetecting,
  isProcessing,
  videoFileName,
}: VideoDisplayProps) {
  // Keep video ref in sync for camera; file src only needed when not showing "Video uploaded" / "Processing"
  useEffect(() => {
    if (videoRef.current && videoUrl && source === "file") {
      videoRef.current.src = videoUrl;
      videoRef.current.load();
      videoRef.current.pause();
    }
  }, [videoUrl, source, videoRef]);

  // Camera: start playing when detecting
  useEffect(() => {
    if (isDetecting && source === "camera" && videoRef.current) {
      videoRef.current.play?.().catch(() => { });
    }
  }, [isDetecting, source, videoRef]);

  const showProcessing = source === "file" && (isProcessing ?? isDetecting);
  const showVideoUploaded = source === "file" && !isDetecting;

  return (
    <Card className="p-4">
      <div className="relative bg-black rounded-lg aspect-video flex items-center justify-center overflow-hidden">
        {source === "none" ? (
          <div className="text-center text-muted-foreground">
            <Video className="h-16 w-16 mx-auto mb-2 opacity-50" />
            <p>No video source selected</p>
            <p className="text-sm mt-1">Upload a video or start camera</p>
          </div>
        ) : showProcessing ? (
          <div className="text-center text-muted-foreground">
            <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-lg font-medium text-white">Processing</p>
            <p className="text-sm mt-1">Analyzing video. This may take a while.</p>
          </div>
        ) : showVideoUploaded ? (
          <div className="text-center text-muted-foreground">
            <Video className="h-16 w-16 mx-auto mb-2 text-primary opacity-80" />
            <p className="text-lg font-medium text-white">Video uploaded</p>
            {videoFileName && (
              <p className="text-sm mt-1 truncate max-w-[90%] mx-auto">{videoFileName}</p>
            )}
            <p className="text-sm mt-1">Click &quot;Start Detection&quot; to analyze</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay={source === "camera"}
              playsInline
              muted
              className="w-full h-full object-contain"
            />
            {isDetecting && source === "camera" && (
              <div className="absolute top-2 right-2">
                <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Detecting
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
