import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    // Simple Frontend Compression (Canvas)
    try {
        const compressedBase64 = await compressImage(file, 0.7, 1024); // Quality 0.7, Max Width 1024
        setPreview(compressedBase64);
        onImageSelected(compressedBase64);
    } catch (e) {
        console.error("Compression failed", e);
        // Fallback to original
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setPreview(base64);
          onImageSelected(base64);
        };
        reader.readAsDataURL(file);
    }
  };

  const compressImage = (file: File, quality: number, maxWidth: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (preview) {
    return (
      <div className="relative w-full h-64 bg-gray-900 rounded-xl overflow-hidden shadow-lg group">
        <img src={preview} alt="Preview" className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
        <button 
          onClick={clearImage}
          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-sm"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all
        ${isDragging ? 'border-blue-500 bg-blue-50 scale-[0.99]' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}
      `}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        accept="image/*" 
        className="hidden" 
      />
      
      <div className="p-4 bg-white rounded-full shadow-sm mb-4">
        <UploadCloud size={32} className="text-blue-500" />
      </div>
      <p className="text-gray-600 font-medium">点击或拖拽上传聊天截图</p>
      <p className="text-gray-400 text-xs mt-1">支持 JPG, PNG (Max 5MB)</p>
    </div>
  );
}
