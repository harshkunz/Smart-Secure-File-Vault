import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import fi from "../assets/fi.png";
import cloud from "../assets/cloud.jpg";

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
    <div className="pt-20 min-h-screen relative bg-black">
      {/* Background layer */}
      <div
        className="h-full w-full absolute inset-0 bg-cover bg-center filter opacity-30"
        style={{ backgroundImage: `url(${cloud})` }}
      />

      {/* Foreground Content */}
      <div className="relative w-full max-w-screen-lg mx-auto px-5 sm:px-16 md:px-16 lg:px-32 text-white">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:px-5xl font-medium mb-2 pt-12">Done! You're on Dashboard</h1>
          <h2 className="text-base sm:text-lg md:text-lg text-gray-300 mb-6 pb-4">Please follow the conditions below</h2>
        </div>

        <div
          className={`border-2 border-dotted ${dragActive ? "border-green-500 bg-green-50" : "border-gray-400"}
            p-6 rounded-lg text-center space-y-6 transition-all duration-200`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex justify-center">
            <img src={fi} alt="File" className="mx-auto h-32 sm:h-44 mb-1 mt-1" />
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
            className={`flex items-center gap-2 justify-center bg-gray-500 hover:bg-blue-600 text-white px-4 py-4 mb-8 rounded-full mx-auto 
              transition-shadow duration-200 ease-in-out 
              hover:shadow-[0_0_20px_6px_rgba(59,130,246,0.6)]
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            <Plus size={30} />
          </button>

          {loading && (
            <div className="relative w-full h-2 rounded mt-7 mb-6 overflow-hidden">
              <div className="absolute h-full bg-white animate-loading-bar" />
            </div>
          )}

          <div className="py-2">
            <p className="text-white">Drag & drop or choose your file</p>
            <p className="text-gray-300 text-sm mt-1">Maximum file size: 50 MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
