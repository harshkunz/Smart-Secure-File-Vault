import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import fileImage from "../assets/fileImage.png";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("File size exceeds 50MB limit");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/upload", { state: { file } });
      }, 1500);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange({ target: { files: [file] } });
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-4xl font-medium mb-2 pt-8">Done! You're on Dashboard</h1>
      <h2 className="text-lg text-gray-600 mb-6 pt-2">Please follow the conditions below</h2>

      <div className={`border border-dashed ${dragActive ? 'border-green-500 bg-green-50' : 'border-gray-400'}
        p-6 rounded-lg text-center space-y-6 transition-all duration-200`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >

        <div className="flex justify-center">
          <img src={fileImage} alt="File" className="mx-auto h-44" />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="*/*"
        />

        <button
          onClick={triggerFileInput}
          className={`flex items-center gap-2 justify-center bg-green-500
              hover:bg-blue-700 text-white px-4 py-4 mb-8 rounded-full mx-auto 
              transition-shadow duration-200 ease-in-out 
              hover:shadow-[0_0_20px_6px_rgba(59,130,246,0.6)]
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
        >
          <Plus size={30} />
        </button>

        {loading && (
          <div className="relative w-full h-2 bg-gray-200 rounded mt-6 mb-6 overflow-hidden">
            <div className="absolute h-full bg-purple-300 animate-loading-bar" />
          </div>
        )}

        <div className="text-gray-500 py-2">
          <p>Drag & drop or choose your file</p>
          <p className="text-sm mt-1">Maximum file size: 50 MB</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
