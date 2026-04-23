"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { uploadBase64 } from "@/lib/imagekit-client";
import { Button } from "@/components/ui/button";

type Props = {
  onUpload: (url: string) => void;
  onChange?: (dataUrl: string) => void;
  label?: string;
};

export default function CameraCapture({
  onUpload,
  onChange,
  label = "Take Photo",
}: Props) {
  const webcamRef = useRef<Webcam | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const doCapture = useCallback(async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    setPreview(imageSrc);
    onChange?.(imageSrc);
    setError(null);
    try {
      setUploading(true);
      const url = await uploadBase64(imageSrc);
      onUpload(url);
    } catch (err) {
      setError((err as any)?.message ?? String(err));
    } finally {
      setUploading(false);
    }
  }, [onChange, onUpload]);

  const startCountdown = () => {
    if (countdown !== null || isUploading) return;
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      doCapture();
      return;
    }
    countdownRef.current = setTimeout(() => {
      setCountdown((c) => (c !== null ? c - 1 : null));
    }, 1000);
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [countdown, doCapture]);

  const retake = () => {
    setPreview(null);
    setError(null);
    setCountdown(null);
  };

  const retryUpload = async () => {
    if (!preview) return;
    setError(null);
    try {
      setUploading(true);
      const url = await uploadBase64(preview);
      onUpload(url);
    } catch (err) {
      setError((err as any)?.message ?? String(err));
    } finally {
      setUploading(false);
    }
  };

  const usePreviewAsUpload = () => {
    if (preview) onUpload(preview);
  };

  const isCountingDown = countdown !== null;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Viewfinder */}
      <div className="relative w-full overflow-hidden rounded-2xl border-2 border-primary/20 bg-black">
        {!preview ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              className="w-full object-cover"
            />

            {/* Countdown overlay */}
            {isCountingDown && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span
                  key={countdown}
                  className="text-white font-display italic text-9xl drop-shadow-lg select-none"
                  style={{
                    animation: "countPop 0.4s cubic-bezier(0.22,1,0.36,1) both",
                  }}
                >
                  {countdown}
                </span>
              </div>
            )}

            {/* Corner guides */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary/60 rounded-tl-md pointer-events-none" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary/60 rounded-tr-md pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary/60 rounded-bl-md pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary/60 rounded-br-md pointer-events-none" />
          </>
        ) : (
          <img src={preview} alt="Preview" className="w-full object-cover" />
        )}
      </div>

      {/* Error message */}
      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      {/* Controls */}
      {!preview ? (
        <div className="flex flex-col items-center gap-2">
          {/* Shutter button — custom circle shape, but uses shadcn Button as base */}
          <Button
            onClick={startCountdown}
            disabled={isUploading || isCountingDown}
            aria-label="Take photo"
            variant="outline"
            className="w-20 h-20 rounded-full border-4 border-primary/40 hover:border-primary bg-primary/10 hover:bg-primary/20 p-0 active:scale-95 transition-all duration-150"
          >
            <span className="w-12 h-12 rounded-full bg-primary block" />
          </Button>
          <p className="text-xs text-muted-foreground">
            {isCountingDown ? `Taking photo in ${countdown}…` : label}
          </p>
        </div>
      ) : (
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            onClick={retake}
            className="flex-1 rounded-xl border-2 border-primary/30 text-primary hover:bg-primary/10"
          >
            Retake
          </Button>

          {error ? (
            <>
              <Button
                onClick={retryUpload}
                disabled={isUploading}
                className="flex-1 rounded-xl"
              >
                {isUploading ? "Uploading…" : "Retry Upload"}
              </Button>
              <Button
                variant="ghost"
                onClick={usePreviewAsUpload}
                className="flex-1 rounded-xl"
              >
                Use Anyway
              </Button>
            </>
          ) : isUploading ? (
            <div className="flex-1 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Uploading…
            </div>
          ) : null}
        </div>
      )}

      <style>{`
        @keyframes countPop {
          0%   { transform: scale(1.8); opacity: 0; }
          60%  { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
