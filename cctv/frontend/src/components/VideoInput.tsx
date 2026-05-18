import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Video, Camera, StopCircle } from "lucide-react";
import type { useVideoStream } from "@/hooks/useVideoStream";

interface VideoInputProps {
  source: ReturnType<typeof useVideoStream>["source"];
  videoFile: ReturnType<typeof useVideoStream>["videoFile"];
  onFileUpload: (file: File) => void;
  onStartCamera: () => void;
  onStop: () => void;
  onStartDetection: () => void;
  onStopDetection: () => void;
  isDetecting: boolean;
}

export function VideoInput({
  source,
  videoFile,
  onFileUpload,
  onStartCamera,
  onStop,
  onStartDetection,
  onStopDetection,
  isDetecting,
}: VideoInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      onFileUpload(file);
    } else {
      alert("Please select a valid video file (MP4, etc.)");
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Video Input</h3>
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
            disabled={isDetecting}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Video
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {/* {source === "camera" ? (
            <Button
              variant="outline"
              onClick={onStop}
              className="flex-1"
              disabled={isDetecting}
            >
              <StopCircle className="mr-2 h-4 w-4" />
              Stop Camera
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={onStartCamera}
              className="flex-1"
              disabled={isDetecting}
            >
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
          )} */}
        </div>

        {source !== "none" && (
          <div className="text-sm text-muted-foreground">
            {source === "file" && videoFile && (
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span>{videoFile.name}</span>
              </div>
            )}
            {source === "camera" && (
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span>Live Camera Feed</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {!isDetecting ? (
            <Button
              onClick={onStartDetection}
              disabled={source === "none"}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Start Detection
            </Button>
          ) : (
            <Button
              onClick={onStopDetection}
              variant="destructive"
              className="flex-1"
            >
              Stop Detection
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
