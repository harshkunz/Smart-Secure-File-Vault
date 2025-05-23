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
import { UserData } from "../context/UserContext";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const FilesPage = () => {
  const { user } = useContext(UserData);
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [activeFile, setActiveFile] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/files`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      
        if (!Array.isArray(response.data)) throw new Error("Invalid response format");
        setFiles(response.data);
        setError("");
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch files");
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/files/${id}`);
      setFiles(prev => prev.filter(file => file._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete file");
    }
  };

  const handleCompression = async (file) => {
    try {
      setProcessing(true);
      setActiveFile(file._id);
      const endpoint = file.compressed ? 'decompress' : 'compress';
      await axios.post(`${BASE_URL}/files/${endpoint}/${file._id}`);
      const response = await axios.get(`${BASE_URL}/files`);
      setFiles(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${file.compressed ? 'decompress' : 'compress'} file`);
    } finally {
      setProcessing(false);
      setActiveFile(null);
    }
  };

  const handleEncryption = async (file) => {
    try {
      setProcessing(true);
      setActiveFile(file._id);
      const endpoint = file.encrypted ? 'decrypt' : 'encrypt';
      await axios.post(`${BASE_URL}/files/${endpoint}/${file._id}`);
      const response = await axios.get(`${BASE_URL}/files`);
      setFiles(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${file.encrypted ? 'decrypt' : 'encrypt'} file`);
    } finally {
      setProcessing(false);
      setActiveFile(null);
    }
  };

  const handleDownload = async (file) => {
    try {
      setProcessing(true);
      setActiveFile(file._id);

      if (file.compressed) await handleCompression(file);
      if (file.encrypted) await handleEncryption(file);

      const response = await axios.get(`${BASE_URL}/files/${file._id}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.filename);
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

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-center mb-4">Your Files</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-8 py-2">
            {files
              .filter((file) =>
                file.filename.toLowerCase().includes(search.toLowerCase())
              )
              .map((file) => (
                <div
                  key={file._id}
                  className="border rounded p-4 flex flex-col items-center text-center shadow rounded-lg hover:bg-purple-100"
                >
                  <div className="border-2 p-8 mt-4 h-16 mb-4 flex items-center justify-center rounded-full hover:bg-green-200">
                    {getIcon(file.filename)}
                  </div>
                  <span className="font-medium">{file.filename}</span>
                  {file.compressed && <span className="text-yellow-600 text-sm">Compressed</span>}
                  {file.encrypted && <span className="text-red-600 text-sm">Encrypted</span>}
                  <div className="flex gap-2 mt-4">
                    <button
                      className="bg-gray-300 mx-1 hover:bg-blue-600 text-black text-sm px-2 py-1 rounded-sm"
                      onClick={() => window.open(`${BASE_URL}/files/preview/${file._id}`)}
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
};

export default FilesPage;
