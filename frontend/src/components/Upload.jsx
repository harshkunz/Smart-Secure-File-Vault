import { useState, useRef } from "react";
import {
  Lock,
  FileText,
  Repeat,
  CloudUpload,
  FileArchive
} from "lucide-react";

const UploadPopup = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [compressedSize, setCompressedSize] = useState(null);
  const [encrypted, setEncrypted] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
      setCompressedSize(null);
      setEncrypted(false);
    }
  };

  const handleCompress = () => {
    if (!file) return;
    const reducedSize = (file.size * 0.6).toFixed(2);
    setCompressedSize(reducedSize);
  };

  const handleEncrypt = () => {
    if (!file) return;
    setEncrypted(true);
  };

  const handleUpload = () => {
    alert("Mock upload - UI only");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-none">
      <div className="bg-gray-200 p-6 shadow-md rounded-sm w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Upload File</h2>

        {/* File Preview */}
        <div className="flex justify-center mb-4 pt-2">
          <div className="w-40 h-40 bg-gray-100 rounded flex items-center justify-center">
            <FileText size={48} className="text-gray-600" />
          </div>
        </div>

        {/* File Info */}
        {file && (
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <span className="w-24 font-medium">Name:</span>
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="border p-1 rounded w-full"
              />
            </div>
            <div className="flex items-center">
              <span className="w-24 font-medium">Type:</span>
              <span>{file.type || "Unknown"}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 font-medium">Size:</span>
              <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
            {compressedSize && (
              <div className="flex items-center">
                <span className="w-24 font-medium">Compressed:</span>
                <span>{(compressedSize / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            )}
            {encrypted && (
              <div className="flex items-center text-green-600">
                <span className="w-24 font-medium">Encrypted:</span>
                <span>Success</span>
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          {/* Compress + Encrypt */}
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={handleCompress}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-blue-700 text-white px-3 py-2 rounded-sm"
            >
              <FileArchive size={18} /> Compress
            </button>
            <button
              onClick={handleEncrypt}
              className="flex items-center gap-2 bg-red-500 hover:bg-blue-700 text-white px-3 py-2 rounded-sm"
            >
              <Lock size={18} /> Encrypt
            </button>
          </div>

          {/* Re-upload */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 bg-gray-400 hover:bg-blue-700 text-white px-4 py-2 rounded-sm"
            >
              <Repeat size={18} /> Re-upload
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Upload to cloud */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleUpload}
              className="flex items-center gap-2 bg-green-500 hover:bg-blue-700 text-white px-4 py-2 rounded-sm"
            >
              <CloudUpload size={18} /> Upload to Cloud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPopup;
