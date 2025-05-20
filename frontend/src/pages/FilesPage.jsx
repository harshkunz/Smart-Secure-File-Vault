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
  FileArchive,
  Lock,
  Unlock
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function FilesPage() {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [activeFile, setActiveFile] = useState(null);

  // Fetch user files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        
        await axios.get("http://localhost:5000/files", { withCredentials: true });
        console.log(res);
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

  // Handle compression/decompression
  const handleCompression = async (file) => {
    try {
      setProcessing(true);
      setActiveFile(file._id);
      const endpoint = file.compressed ? 'decompress' : 'compress';
      await api.post(`/files/${endpoint}/${file._id}`);
      const response = await api.get('/files');
      setFiles(response.data);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${file.compressed ? 'decompress' : 'compress'} file`);
    } finally {
      setProcessing(false);
      setActiveFile(null);
    }
  };

  // Handle encryption/decryption
  const handleEncryption = async (file) => {
    try {
      setProcessing(true);
      setActiveFile(file._id);
      const endpoint = file.encrypted ? 'decrypt' : 'encrypt';
      await api.post(`/files/${endpoint}/${file._id}`);
      const response = await api.get('/files');
      setFiles(response.data);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${file.encrypted ? 'decrypt' : 'encrypt'} file`);
    } finally {
      setProcessing(false);
      setActiveFile(null);
    }
  };

  // Handle file download
  const handleDownload = async (file) => {
    try {
      setProcessing(true);
      setActiveFile(file._id);

      let currentFile = file;

      // Decompress if needed
      if (file.compressed) {
        await handleCompression(file);
        const updatedFile = files.find(f => f._id === file._id);
        if (updatedFile) currentFile = updatedFile;
      }

      // Decrypt if needed
      if (file.encrypted) {
        await handleEncryption(currentFile);
        const updatedFile = files.find(f => f._id === file._id);
        if (updatedFile) currentFile = updatedFile;
      }

      const response = await api.get(`/files/${file._id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to download file");
    } finally {
      setProcessing(false);
      setActiveFile(null);
    }
  };

  const getIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (ext === "pdf") return <FileText size={40} />;
    if (["png", "jpg", "jpeg", "gif"].includes(ext)) return <Image size={40} />;
    if (["mp4", "mov", "avi"].includes(ext)) return <Film size={40} />;
    return <FileText size={40} />;
  };

  return (
    <div className="p-4 sm:px-8 lg:px-16">
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
                  {file.compressed && (
                    <span className="text-yellow-600 text-sm">Compressed</span>
                  )}
                  {file.encrypted && (
                    <span className="text-red-600 text-sm">Encrypted</span>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button 
                      className="bg-gray-300 mx-1 hover:bg-blue-600 text-black text-sm px-2 py-1 rounded-sm"
                      onClick={() => window.open(`${api.defaults.baseURL}/files/preview/${file._id}`)}
                      disabled={processing && activeFile === file._id}
                    >
                      <Eye size={20} />
                    </button>
                    <button 
                      className="bg-green-500 mx-1 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded-sm"
                      onClick={() => handleDownload(file)}
                      disabled={processing && activeFile === file._id}
                    >
                      <Download size={20} />
                    </button>
                    <button
                      onClick={() => handleCompression(file)}
                      className={`mx-1 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded-sm ${
                        file.compressed ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}
                      disabled={processing && activeFile === file._id}
                    >
                      <FileArchive size={20} />
                    </button>
                    <button
                      onClick={() => handleEncryption(file)}
                      className={`mx-1 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded-sm ${
                        file.encrypted ? 'bg-blue-500' : 'bg-red-500'
                      }`}
                      disabled={processing && activeFile === file._id}
                    >
                      {file.encrypted ? <Unlock size={20} /> : <Lock size={20} />}
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="bg-red-500 mx-1 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded-sm"
                      disabled={processing && activeFile === file._id}
                    >
                      <Trash2 size={20} />
                    </button>
                    <button 
                      className="bg-purple-500 mx-1 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded-sm"
                      disabled={processing && activeFile === file._id}
                    >
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