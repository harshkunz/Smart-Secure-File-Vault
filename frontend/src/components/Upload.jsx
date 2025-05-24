import { useState, useRef, useEffect, useContext } from "react";
import {
  Lock,
  FileText,
  Repeat,
  CloudUpload,
  FileArchive,
  User
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserData } from '../context/UserContext';
import axios from 'axios';

const BASE_URL = "http://localhost:5000";

const Upload = () => {
  const { user } = useContext(UserData);
  const navigate = useNavigate();
  const location = useLocation();
  const initialFile = location.state?.file || null;

  const [file, setFile] = useState(initialFile);
  const [fileName, setFileName] = useState(initialFile?.name || "");
  const [compressedSize, setCompressedSize] = useState(null);
  const [encrypted, setEncrypted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
 
  const fileInputRef = useRef();

  const id = user?._id || null;
  
  useEffect(() => {
    if (initialFile) {
      if (initialFile.size > 50 * 1024 * 1024) {
        setError("File size exceeds 50MB limit");
        return;
      }
      setFile(initialFile);
      setFileName(initialFile.name);
    }
  }, [initialFile]);


  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 50 * 1024 * 1024) {
        setError("File size exceeds 50MB limit");
        return;
      }
      setFile(selected);
      setFileName(selected.name);
      setCompressedSize(null);
      setEncrypted(false);
      setError('');
    }
  };

  const handleCompress = async () => {
    if (!file) {
      setError('Please select a file to compress');
      return;
    }
    if (!user) {
      setError('Please login to compress files');
      return;
    }
    setIsCompressing(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      
      const response = await axios.post(`${BASE_URL}files/compress/${id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data && response.data.compressedSize) {
        setCompressedSize(response.data.compressedSize);
        if (response.data.file) {
          setFile(new Blob([response.data.file], { type: file.type }));
        }
      } else {
        throw new Error('Compression failed');
      }
    } catch (err) {
      console.error('Compression error:', err);
      setError(err.response?.data?.message || 'Compression failed');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleEncrypt = async () => {
    if (!file) {
      setError('Please select a file to encrypt');
      return;
    }
    if (!user) {
      setError('Please login to encrypt files');
      return;
    }
    setIsEncrypting(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      
      const response = await axios.post(`${BASE_URL}/files/encrypt/${id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.success) {
        setEncrypted(true);
        if (response.data.file) {
          setFile(new Blob([response.data.file], { type: file.type }));
        }
      } else {
        throw new Error('Encryption failed');
      }
    } catch (err) {
      console.error('Encryption error:', err);
      setError(err.response?.data?.message || 'Encryption failed');
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    if (!user) {
      setError('Please login to upload files');
      return;
    }
    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('compressed', Boolean(compressedSize));
      formData.append('encrypted', encrypted);

      const response = await axios.post(`${BASE_URL}/files/upload/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      });

      if (response.data && response.data.success) {
        navigate('/files');
      } else {
        throw new Error(response.data?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
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

        {error && (
          <div className="text-red-500 text-center text-sm mt-2">
            {error}
          </div>
        )}

        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <div className="mt-6 space-y-3">
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={handleCompress}
              className={`flex items-center gap-2 ${
                isCompressing ? 'bg-gray-500' : 'bg-yellow-500 hover:bg-blue-700'
              } text-white px-3 py-2 rounded-sm`}
              disabled={ uploading || isCompressing}
            >
              <FileArchive size={18} />
              {isCompressing ? 'Compressing...' : 'Compress'}
            </button>

            <button
              onClick={handleEncrypt}
              className={`flex items-center gap-2 ${
                isEncrypting ? 'bg-gray-500' : 'bg-red-500 hover:bg-blue-700'
              } text-white px-3 py-2 rounded-sm`}
              disabled={ uploading || isEncrypting}
            >
              <Lock size={18} />
              {isEncrypting ? 'Encrypting...' : 'Encrypt'}
            </button>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 bg-gray-400 hover:bg-blue-700 text-white px-4 py-2 rounded-sm"
              disabled={uploading || isCompressing || isEncrypting}
            >
              <Repeat size={18} /> Re-upload
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="*/*"
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleUpload}
              className="flex items-center gap-2 bg-green-500 hover:bg-blue-700 text-white px-4 py-2 rounded-sm"
              disabled={ uploading || isCompressing || isEncrypting}
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

export default Upload;