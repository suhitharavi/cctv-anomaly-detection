import { useState, useRef, useCallback } from "react";

export type VideoSource = "none" | "file" | "camera";

export function useVideoStream() {
  const [source, setSource] = useState<VideoSource>("none");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileUpload = useCallback((file: File) => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setSource("file");
  }, [videoUrl]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setSource("camera");
    } catch (error) {
      console.error("Failed to access camera:", error);
      alert("Failed to access camera. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setSource("none");
  }, []);

  const stopFile = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
    }
    setVideoFile(null);
    setSource("none");
  }, [videoUrl]);

  const stop = useCallback(() => {
    if (source === "camera") {
      stopCamera();
    } else if (source === "file") {
      stopFile();
    }
  }, [source, stopCamera, stopFile]);

  return {
    source,
    videoFile,
    videoUrl,
    videoRef,
    handleFileUpload,
    startCamera,
    stop,
  };
}
