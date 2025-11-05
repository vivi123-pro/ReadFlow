import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiFile, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';

const UploadArea = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file only.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB.');
      return;
    }
    setSelectedFile(file);
    setError(null);
    setSelectedMode(null);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadComplete(false);
    setError(null);
    setSelectedMode(null);
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    simulateUpload(mode);
  };

  const simulateUpload = (mode) => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          // Navigate to reading interface after a short delay
          setTimeout(() => {
            navigate('/read', { state: { mode, fileName: selectedFile.name } });
          }, 1500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  if (selectedFile && !uploadComplete) {
    return (
      <div className="relative group">
        <div className="border-2 border-solid border-border rounded-2xl p-8 bg-white shadow-sm">
          <div className="max-w-md mx-auto">
            {/* File Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-accent1 to-accent2 rounded-xl flex items-center justify-center">
                  <FiFile className="text-white text-xl" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-text">{selectedFile.name}</h4>
                  <p className="text-text/60 text-sm">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • PDF
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="w-8 h-8 bg-border rounded-full flex items-center justify-center hover:bg-accent2 transition-colors"
              >
                <FiX className="text-text" />
              </button>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text/70 text-sm">Processing...</span>
                  <span className="text-text/70 text-sm">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-accent1 to-accent2 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Mode Selection */}
            {!isUploading && !selectedMode && (
              <div className="space-y-4">
                <h4 className="font-serif text-lg text-text text-center mb-4">Choose Your Reading Experience</h4>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => handleModeSelect('direct')}
                    className="p-4 border-2 border-border rounded-xl hover:border-accent1 hover:bg-accent1/5 transition-all text-left"
                  >
                    <h5 className="font-serif text-base text-text mb-2">Direct Mode</h5>
                    <p className="text-text/70 text-sm leading-relaxed">
                      Clean, factual reading experience for professional documents.
                    </p>
                  </button>
                  <button
                    onClick={() => handleModeSelect('story')}
                    className="p-4 border-2 border-accent2 rounded-xl hover:border-accent2/80 hover:bg-accent2/10 transition-all text-left"
                  >
                    <h5 className="font-serif text-base text-text mb-2">Story Mode</h5>
                    <p className="text-text/70 text-sm leading-relaxed">
                      AI-powered narrative transformation based on your interests.
                    </p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (uploadComplete) {
    return (
      <div className="relative group">
        <div className="border-2 border-solid border-highlight rounded-2xl p-8 bg-white shadow-sm">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-accent1 to-accent2 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiCheck className="text-white text-2xl" />
            </div>
            <h3 className="font-serif text-xl text-text mb-3">Document Processed!</h3>
            <p className="text-text/70 mb-6">Redirecting to your reading experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-accent1 bg-accent1/5 shadow-lg'
            : 'border-border group-hover:border-accent1 group-hover:bg-accent1/5 group-hover:shadow-sm'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input-landing').click()}
      >
        <div className="max-w-md mx-auto">
          <div className={`w-16 h-16 bg-gradient-to-r from-accent1 to-accent2 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300 ${
            isDragging ? 'scale-110' : 'group-hover:scale-110'
          }`}>
            <FiUpload className="text-white text-2xl" />
          </div>

          <h3 className="text-xl font-serif text-text mb-3">
            {isDragging ? 'Drop your PDF here' : 'Upload your document'}
          </h3>

          <p className="text-text/70 mb-6">
            Drag & drop your PDF or click to browse. We'll transform it into your personal story.
          </p>

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
            id="file-input-landing"
          />

          {error && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-accent2">
              <FiAlertCircle className="text-lg" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent1/10 to-accent2/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
    </div>
  );
};

export default UploadArea;
