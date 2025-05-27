import { useState, useRef, useEffect, useContext } from "react";
import { FileText, Repeat, CloudUpload } from "lucide-react";
import { PiFileText } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import { UserData } from '../context/UserContext';
import cloud from '../assets/cloud.jpg';
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
  const [loading, setloading] = useState(false);
 
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
      setloading(true);
      setTimeout(() => {
        setloading(false);
        setFile(selected);
        setFileName(selected.name);
        setError('');
      }, 1500);
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
    <div className="pt-20 min-h-screen relative bg-black">
      {/* Background layer */}
        <div
          className="h-full w-full absolute inset-0 bg-cover bg-center filter opacity-30"
          style={{ backgroundImage: `url(${cloud})` }}
        />

      {/* Foreground Content */}
      <div className="relative w-full max-w-screen-lg mx-auto px-5 sm:px-32 md:px-46 lg:px-64">
        <div className="text-white items-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:px-5xl font-medium mb-2 pt-12">Upload files</h1>
          <h2 className="text-base sm:text-lg md:text-lg text-gray-300 mb-6 pb-4">Please follow the instructions below</h2>
        </div>

        {/* Upload Card */}
        <div className= "border-2 border-dotted border-gray-400 py-6 px-2 pt-5  rounded-lg text-center space-y-6 transition-all duration-200">

          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 flex items-center justify-center transition">
              <PiFileText size={120} className="text-white" />
            </div>
          </div>

          {file ? (
            <div className="space-y-3 text-sm text-white">

              <div className="flex flex-col pt-2 border border-gray-500 rounded-lg py-3 mx-8">
                <span className="w-24 font-medium text-gray-300 text-center mb-1 pl-1">NAME</span>
                <div className="flex justify-center px-6">
                  <input
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="border-b border-gray-500 focus:border-white bg-transparent text-white focus:outline-none 
                              hover:bg-white hover:bg-opacity-30 
                              w-full max-w-md py-1 pl-3"
                  />
                </div>
              </div>

              <div className="flex items-center border border-gray-500 rounded-lg py-2 mx-8">
                <span className="w-24 font-medium text-gray-300">TYPE</span>
                <span >{file.type || "Unknown"}</span>
              </div>
              <div className="flex items-center border border-gray-500 rounded-lg py-2 mx-8">
                <span className="w-24 font-medium text-gray-300">SIZE</span>
                <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-red-400">No file selected.</p>
          )}

          {error && (
            <div className="text-red-400 text-center text-sm mt-2">
              {error}
            </div>
          )}

          {uploading && (
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
              <div
                className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {loading && (
            <div className="relative w-full h-2 rounded mt-7 mb-6 overflow-hidden">
              <div className="absolute h-full bg-white animate-loading-bar" />
            </div>
          )}

          <div className="mt-6 space-y-3">
            <div className="flex justify-center pt-2">
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 bg-gray-600 hover:bg-white hover:text-black text-white px-4 py-2 rounded-md transition"
                disabled={uploading || loading}
              >
                <Repeat size={18} />
                {loading ? "Reloading..." : "Re-upload"}
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
                className="flex items-center gap-2 bg-blue-500 hover:bg-white hover:text-black text-white px-4 py-2 mb-2 rounded-md transition"
                disabled={uploading}
              >
                <CloudUpload size={18} />
                {uploading ? "Uploading..." : "Upload to Cloud"}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
    
  );
};

export default Upload;