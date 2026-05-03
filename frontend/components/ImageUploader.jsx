import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

const ImageUploader = ({ onUploadSuccess, isAnalyzing }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setShowUrlInput(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setShowUrlInput(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setImageUrl('');
  };

  const handleAnalyze = async () => {
    if (showUrlInput && imageUrl) {
      onUploadSuccess(imageUrl, null); // No publicId for external URLs
      return;
    }

    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.url && data.publicId) {
        onUploadSuccess(data.url, data.publicId);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="section-label">Input Product</div>
        <button 
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] font-bold uppercase tracking-wider text-secondary hover:underline"
        >
          {showUrlInput ? "Use Upload" : "Use URL"}
        </button>
      </div>

      {showUrlInput ? (
        <div className="space-y-3">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste image URL (e.g. https://...)"
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm"
          />
          {imageUrl && (
            <div className="rounded-xl overflow-hidden border border-border">
              <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover" />
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => !preview && fileInputRef.current?.click()}
          className={clsx(
            "relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer text-center",
            isDragging ? "border-secondary bg-violet-50" : "border-[#D3D1C7] hover:border-secondary hover:bg-[#F5F3FF]",
            preview && "border-none p-0 cursor-default"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
          />

          {!preview ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-text-muted">
                <Upload size={24} />
              </div>
              <div>
                <p className="font-medium">Click or drag to upload</p>
                <p className="text-xs text-text-muted mt-1">PNG, JPG or WEBP (max 5MB)</p>
              </div>
            </div>
          ) : (
            <div className="relative group rounded-xl overflow-hidden bg-surface border border-border p-4">
              <div className="flex items-center gap-4">
                <img src={preview} alt="Preview" className="w-[100px] h-[100px] object-cover rounded-lg border border-border" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm truncate max-w-[150px]">{file.name}</p>
                  <p className="text-xs text-text-muted">Ready for analysis</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); clearFile(); }}
                  className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        disabled={(!file && !imageUrl) || isAnalyzing}
        onClick={handleAnalyze}
        className={clsx(
          "w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
          (!file && !imageUrl) || isAnalyzing 
            ? "bg-[#E8E6E0] text-text-muted cursor-not-allowed" 
            : "bg-secondary text-white hover:opacity-90 shadow-lg shadow-violet-200"
        )}
      >
        {isAnalyzing ? "Processing..." : "Analyze Image"}
      </button>
    </div>
  );
};

export default ImageUploader;
