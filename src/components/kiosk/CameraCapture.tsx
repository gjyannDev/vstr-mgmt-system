"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { uploadBase64 } from "@/lib/imagekit-client";

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

  const capture = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    setPreview(imageSrc);
    onChange?.(imageSrc);
    try {
      setUploading(true);
      const url = await uploadBase64(imageSrc);
      onUpload(url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "user" }}
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-48 h-48 object-cover rounded-md"
        />
      )}
      <Button onClick={capture} disabled={isUploading}>
        {isUploading ? "Uploading..." : label}
      </Button>
    </div>
  );
}
