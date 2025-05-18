import { useState, useEffect, useContext } from "react";
import {
  Download,
  Trash2,
  Share2,
  Eye,
  Search,
  FileText,
  Image,
  Film,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export default function FilesPage() {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await api.get('/files');
        setFiles(response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch files");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchFiles();
  }, [user]);

  // Handle file deletion
  const handleDelete = async (id) => {
    try {
      await api.delete(`/files/${id}`);
      setFiles(prev => prev.filter(file => file._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete file");
    }
  };

  // Handle file download
  const handleDownload = async (id, filename) => {
    try {
      const response = await api.get(`/files/${id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to download file");
    }
  };

  //getIcon function...
  const getIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (ext === "pdf") return <FileText size={40} />;
    if (["png", "jpg", "jpeg", "gif"].includes(ext)) return <Image size={40} />;
    if (["mp4", "mov", "avi"].includes(ext)) return <Film size={40} />;
    return <FileText size={40} />;
  };

  return (
    <div className="p-4 sm:px-8 lg:px-16">
      {/* Search Bar */}
      <div className="mb-4 px-8 py-2 flex gap-2">
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-full w-full hover:bg-purple-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button className="bg-green-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full">
          <Search size={18} />
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-center mb-4">Your Files</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-8 py-2">
            {files
              .filter((file) =>
                file.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((file) => (
                <div
                  key={file._id}
                  className="border rounded p-4 flex flex-col items-center text-center shadow rounded-lg hover:bg-purple-100"
                >
                  <div className="border-2 p-8 mt-4 h-16 mb-4 flex items-center justify-center rounded-full hover:bg-green-200">
                    {getIcon(file.name)}
                  </div>
                  <span className="font-medium">{file.name}</span>
                  <div className="flex gap-2 mt-4">
                    <button 
                      className="bg-gray-300 mx-1 hover:bg-blue-600 text-black text-sm px-2 py-1 rounded-sm"
                      onClick={() => window.open(`${api.defaults.baseURL}/files/preview/${file._id}`)}
                    >
                      <Eye size={20} />
                    </button>
                    <button 
                      className="bg-green-500 mx-1 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded-sm"
                      onClick={() => handleDownload(file._id, file.name)}
                    >
                      <Download size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="bg-red-500 mx-1 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded-sm"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button className="bg-purple-500 mx-1 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded-sm">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}