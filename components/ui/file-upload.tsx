'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  File, 
  Video, 
  X,
  CheckCircle 
} from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function FileUpload({ onFileSelect, isProcessing }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: false
  });

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['mp4', 'mov', 'avi'].includes(extension || '')) {
      return <Video className="w-6 h-6 text-red-500" />;
    } else if (['pdf'].includes(extension || '')) {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else {
      return <File className="w-6 h-6 text-blue-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };

  const handleProcess = () => {
    if (uploadedFile) {
      onFileSelect(uploadedFile);
    }
  };

  if (uploadedFile) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            {getFileIcon(uploadedFile.name)}
            <div className="flex-grow">
              <h4 className="font-medium text-gray-900">{uploadedFile.name}</h4>
              <p className="text-sm text-gray-500">{formatFileSize(uploadedFile.size)}</p>
              {uploadProgress < 100 ? (
                <Progress value={uploadProgress} className="mt-2 h-2" />
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Upload complete</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleProcess}
            disabled={uploadProgress < 100 || isProcessing}
            className="bg-gradient-primary hover:opacity-90 text-white px-6 py-2 rounded-xl"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Process File'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
        ${isDragActive 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }
      `}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
          <Upload className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isDragActive ? 'Drop your file here' : 'Upload your file'}
          </h3>
          <p className="text-gray-600 mb-4">
            Drop files here or click to browse
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-sm">
          <div className="bg-blue-50 p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Documents</span>
            </div>
            <p className="text-blue-700">PDF, DOC, DOCX, TXT</p>
          </div>
          <div className="bg-red-50 p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Video className="w-4 h-4 text-red-600" />
              <span className="font-medium text-red-900">Videos</span>
            </div>
            <p className="text-red-700">MP4, MOV, AVI</p>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Maximum file size: 100MB
        </p>
      </div>
    </div>
  );
}