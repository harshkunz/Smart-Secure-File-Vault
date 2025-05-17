import { useState, useRef, useEffect } from "react";
import {
  Lock,
  FileText,
  Repeat,
  CloudUpload,
  FileArchive
} from "lucide-react";
import { useLocation } from "react-router-dom";

const UploadPopup = () => {
  const location = useLocation();
  const initialFile = location.state?.file || null;

  const [file, setFile] = useState(initialFile);
  const [fileName, setFileName] = useState(initialFile?.name || "");
  const [compressedSize, setCompressedSize] = useState(null);
  const [encrypted, setEncrypted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (initialFile) {
      setFile(initialFile);
      setFileName(initialFile.name);
    }
  }, [initialFile]);

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
    setUploading(true);
    setTimeout(() => {
      alert("Mock upload - UI only");
      setUploading(false);
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-none">
      <div className="bg-gray-200 p-6 shadow-md rounded-sm w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Upload File</h2>

        <div className="flex justify-center mb-4 pt-2">
          <div className="w-40 h-40 bg-white hover:bg-green-100 rounded flex items-center justify-center">
            <FileText size={60} className="text-gray-600" />
          </div>
        </div>

        {file ? (
          <div className="space-y-2 text-sm">
            <div className="flex items-center pt-2">
              <span className="w-24 font-medium">Name:</span>
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="border hover:bg-green-100 p-1 rounded-sm w-full"
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
              <div className="flex items-center text-green-600 pt-2">
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
        ) : (
          <p className="text-center text-sm text-red-500">No file selected.</p>
        )}

        <div className="mt-6 space-y-3">
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={handleCompress}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-blue-700 text-white px-3 py-2 rounded-sm"
              disabled={!file || uploading}
            >
              <FileArchive size={18} /> Compress
            </button>
            <button
              onClick={handleEncrypt}
              className="flex items-center gap-2 bg-red-500 hover:bg-blue-700 text-white px-3 py-2 rounded-sm"
              disabled={!file || uploading}
            >
              <Lock size={18} /> Encrypt
            </button>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 bg-gray-400 hover:bg-blue-700 text-white px-4 py-2 rounded-sm"
              disabled={uploading}
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

          <div className="flex justify-center pt-2">
            <button
              onClick={handleUpload}
              className="flex items-center gap-2 bg-green-500 hover:bg-blue-700 text-white px-4 py-2 rounded-sm"
              disabled={!file || uploading}
            >
              <CloudUpload size={18} />
              {uploading ? "Uploading..." : "Upload to Cloud"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPopup;
