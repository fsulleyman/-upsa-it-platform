import React, { useState, useRef } from 'react';
import { Upload, Trash2, RefreshCw, Image as ImageIcon, AlertCircle, CheckCircle2, Link as LinkIcon, Loader2 } from 'lucide-react';
import { uploadSiteImage, deleteSiteImage, MAX_FILE_SIZE_MB, ALLOWED_MIME_TYPES } from '../../utils/storage';
import type { StorageFolder } from '../../utils/storage';

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: StorageFolder;
  label?: string;
  maxSizeMB?: number;
  aspectHint?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = '',
  onChange,
  folder = 'general',
  label = 'Image Asset',
  maxSizeMB = MAX_FILE_SIZE_MB,
  aspectHint,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState(value || '');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processAndUploadFile(file);
    }
  };

  const processAndUploadFile = async (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsUploading(true);

    try {
      const res = await uploadSiteImage(file, folder, maxSizeMB);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.publicUrl) {
        onChange(res.publicUrl);
        setManualUrlInput(res.publicUrl);
        setSuccessMsg('Image uploaded successfully to site-media storage bucket!');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload image file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processAndUploadFile(file);
    }
  };

  const handleRemoveImage = async () => {
    if (value) {
      // Safely cleanup from storage if it's hosted on site-media
      await deleteSiteImage(value);
    }
    onChange('');
    setManualUrlInput('');
    setSuccessMsg('Image reference removed.');
    setErrorMsg(null);
  };

  const handleManualUrlSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrlInput.trim()) {
      onChange(manualUrlInput.trim());
      setSuccessMsg('External Image URL applied.');
      setErrorMsg(null);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-300">
            {label}
            {aspectHint && <span className="text-[10px] text-slate-400 font-normal ml-2">({aspectHint})</span>}
          </label>
          <button
            type="button"
            onClick={() => setShowManualUrl(!showManualUrl)}
            className="text-[10px] font-bold text-[#00AEEF] hover:underline flex items-center gap-1"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showManualUrl ? 'Use File Upload' : 'Paste Image URL'}</span>
          </button>
        </div>
      )}

      {/* Manual URL Input Fallback */}
      {showManualUrl ? (
        <form onSubmit={handleManualUrlSave} className="flex gap-2">
          <input
            type="url"
            value={manualUrlInput}
            onChange={(e) => setManualUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#F2B705]"
          />
          <button
            type="submit"
            className="px-3 py-2 text-xs font-bold bg-[#003366] hover:bg-blue-900 text-white rounded-lg transition-colors"
          >
            Apply URL
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          {/* Preview Container & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed p-4 transition-colors flex flex-col items-center justify-center text-center gap-3 ${
              isDragOver
                ? 'border-[#F2B705] bg-[#F2B705]/10'
                : value
                ? 'border-slate-700 bg-slate-900/60'
                : 'border-slate-700 bg-slate-900 hover:border-slate-600'
            }`}
          >
            {value ? (
              <div className="w-full flex flex-col sm:flex-row items-center gap-4">
                {/* Thumbnail Preview */}
                <div className="relative w-28 h-28 shrink-0 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center group shadow-md">
                  <img
                    src={value}
                    alt="Current preview"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Info & Action Controls */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Image Configured</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono truncate max-w-xs sm:max-w-md">
                    {value}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-md bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Replace Image</span>
                    </button>

                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={handleRemoveImage}
                      className="px-3 py-1.5 rounded-md bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Image</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[#F2B705] mx-auto">
                  {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">
                    {isUploading ? 'Uploading to Supabase Storage...' : 'Drag & drop image file here, or browse'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Supports JPG, PNG, WEBP, GIF (Max {maxSizeMB} MB)
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-extrabold tracking-wider uppercase inline-flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm mt-1"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Image File</span>
                </button>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_MIME_TYPES.join(',')}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* Uploading Status Overlay Bar */}
      {isUploading && (
        <div className="p-3 rounded-lg bg-[#003366]/40 border border-[#003366] text-white text-xs flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-[#F2B705] animate-spin shrink-0" />
          <span>Uploading file to site-media/{folder} folder... Please wait.</span>
        </div>
      )}

      {/* Validation / Success Messages */}
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-200 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && !errorMsg && (
        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
};
