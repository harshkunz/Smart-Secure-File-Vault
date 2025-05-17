import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import fileImage from "../assets/fileImage.png";

export default function DashboardX() {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/ui", { state: { file } }); // Pass file via router state
      }, 1500);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-4xl font-medium mb-2 pt-8">Done! You're on Dashboard</h1>
      <h2 className="text-lg text-gray-600 mb-6 pt-2">Please follow the conditions below</h2>

      <div className="border border-dashed border-gray-400 p-6 rounded-lg text-center space-y-6">
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
          className="flex items-center gap-2 justify-center bg-green-500 hover:bg-blue-700 text-white px-4 py-4 mb-8 rounded-full mx-auto 
              transition-shadow duration-200 ease-in-out 
              hover:shadow-[0_0_20px_6px_rgba(59,130,246,0.6)]"
        >
          <Plus size={30} />
        </button>

        {loading && (
          <div className="relative w-full h-2 bg-gray-200 rounded mt-6 mb-6 overflow-hidden">
            <div className="absolute h-full bg-purple-300 animate-loading-bar" />
          </div>
        )}

        <div className="text-gray-500 py-2">
          <p>Choose or drop your file here</p>
          <p className="text-sm mt-1">Max. 50 MB</p>
        </div>
      </div>
    </div>
  );
}
