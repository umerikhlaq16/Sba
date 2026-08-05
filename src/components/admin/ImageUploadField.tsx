"use client";

import { useRef, useState } from "react";
import { uploadToCloudinary, cloudinaryEnabled } from "@/lib/cloudinary";
import Spinner from "@/components/Spinner";

export default function ImageUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const MAX_SIZE_KB = 500;
  const MAX_SIZE_BYTES = MAX_SIZE_KB * 1024;

  async function handleFile(file: File | undefined) {
    if (!file) return;

    const sizeKb = Math.round(file.size / 1024);

    if (file.size > MAX_SIZE_BYTES) {
      const message = `Image is too large (${sizeKb}KB). Max allowed size is ${MAX_SIZE_KB}KB — please choose a smaller image.`;
      setError(message);
      window.alert(message);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setError("");
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-4">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="#d1d5db" strokeWidth="1.4" />
              <path d="M3 16l5-5 4 4 3-3 6 6" stroke="#d1d5db" strokeWidth="1.4" strokeLinejoin="round" />
              <circle cx="8" cy="9" r="1.5" fill="#d1d5db" />
            </svg>
          )}

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Spinner size={20} />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading || !cloudinaryEnabled}
              className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900 disabled:opacity-50"
            >
              {value ? "Change image" : "Upload image"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-lg px-3 py-2 text-xs text-gray-400 transition-colors hover:text-red-500"
              >
                Remove
              </button>
            )}
          </div>

          {!cloudinaryEnabled && (
            <p className="text-xs text-gray-400">
              Cloudinary is not configured, add your keys to .env.local to enable uploads.
            </p>
          )}
          <p className="text-xs text-gray-400">Max file size: {MAX_SIZE_KB}KB.</p>
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
