import { useState, useRef, useEffect, useContext } from "react";
import { FileText, Repeat, CloudUpload } from "lucide-react";
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
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
 
  const fileInputRef = useRef();
  
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
      setError('');
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
      formData.append('userId', user._id);

      const response = await axios.post(`${BASE_URL}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token}`
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      });
      console.log('Upload response:', response.data);

      if (response.data) {
        setFile(null);
        setFileName('');
        navigate('/files');
      } else {
        throw new Error(response.data?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      if (err.response?.status === 403) {
        setError('Session expired. Please login again.');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Upload failed');
      }
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
              accept="*/*"
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleUpload}
              className="flex items-center gap-2 bg-green-500 hover:bg-blue-700 text-white px-4 py-2 rounded-sm"
              disabled={uploading}
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