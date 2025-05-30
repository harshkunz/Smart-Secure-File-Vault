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
import c1 from '../assets/c1.jpg';
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FilesPage = () => {
  const { user } = useContext(UserData);
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [activeFile, setActiveFile] = useState(null);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [previewingFile, setPreviewingFile] = useState(null);
  const [deletingFile, setDeletingFile] = useState(null); // New state for delete loading
  const [compressingFile, setCompressingFile] = useState(null);
  const [encryptingFile, setEncryptingFile] = useState(null);

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
  

  const handlePreview = async (file) => {
    try {
      setProcessing(true);
      setActiveFile(file._id);
      setPreviewingFile(file._id);
      
      // 2 second delay before opening
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Open preview in a new window first
      const previewWindow = window.open('about:blank', '_blank');
      
      const response = await axios.get(`${BASE_URL}/files/preview/${file._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob'
      });

      // Get the correct MIME type from the response
      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      // For PDFs and images, show them directly in the preview window
      if (contentType.includes('pdf') || contentType.includes('image')) {
        previewWindow.location.href = url;
      } else {
        // For other file types, try to use Google Docs Viewer
        const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
        previewWindow.location.href = googleDocsUrl;
      }

      // Clean up blob URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      console.error('Preview error:', err);
      setError(err.response?.data?.message || "Failed to preview file");
    } finally {
      setProcessing(false);
      setActiveFile(null);
      setPreviewingFile(null);
    }
  };

  const handleDelete = async (id) => {
    // Show confirmation dialog
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      setProcessing(true);
      setActiveFile(id);
      setDeletingFile(id);
      setError('');

      // Add loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      await axios.delete(`${BASE_URL}/files/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Update files list
      setFiles(prev => prev.filter(file => file._id !== id));
      
      // Show success message
      setError('File deleted successfully');
      setTimeout(() => setError(''), 3000); // Clear success message after 3s
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete file');
    } finally {
      setProcessing(false);
      setActiveFile(null);
      setDeletingFile(null);
    }
  };

  const handleCompression = async (file) => {
    const action = file.compressed ? 'decompress' : 'compress';
    if (!window.confirm(`Do you want to ${action} this file?`)) {
      return;
    }

    try {
      setProcessing(true);
      setActiveFile(file._id);
      setCompressingFile(file._id);
      setError('');

      const endpoint = file.compressed ? 'decompress' : 'compress';
      const re = await axios.post(`${BASE_URL}/files/${endpoint}/${file._id}`, 
        { fileId: file._id }, // Add request body
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console

      // Refresh files list
      const response = await axios.get(`${BASE_URL}/files`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setFiles(response.data);
      setError(`File ${file.compressed ? 'decompressed' : 'compressed'} successfully`);
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      console.error('Compression error:', err);
      setError(err.response?.data?.message || `Failed to ${action} file`);
    } finally {
      setProcessing(false);
      setActiveFile(null);
      setCompressingFile(null);
    }
  };

  const handleEncryption = async (file) => {
    const action = file.encrypted ? 'decrypt' : 'encrypt';
    if (!window.confirm(`Do you want to ${action} this file?`)) {
      return;
    }

    try {
      setProcessing(true);
      setActiveFile(file._id);
      setEncryptingFile(file._id);
      setError('');

      const endpoint = file.encrypted ? 'decrypt' : 'encrypt';
      await axios.post(`${BASE_URL}/files/${endpoint}/${file._id}`, 
        { fileId: file._id }, // Add request body
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Refresh files list
      const response = await axios.get(`${BASE_URL}/files`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setFiles(response.data);
      setError(`File ${file.encrypted ? 'decrypted' : 'encrypted'} successfully`);
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      console.error('Encryption error:', err);
      setError(err.response?.data?.message || `Failed to ${action} file`);
    } finally {
      setProcessing(false);
      setActiveFile(null);
      setEncryptingFile(null);
    }
  };

  const handleDownload = async (file) => {
    try {
      setProcessing(true);
      setActiveFile(file._id);
      setDownloadingFile(file._id);

      // Simulate 2 second loading
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await axios.get(`${BASE_URL}/files/${file._id}`, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
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
      setDownloadingFile(null);
    }
  };

  const getIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (ext === "pdf") return <FileText size={40} />;
    if (["png", "jpg", "jpeg", "gif"].includes(ext)) return <Image size={40} />;
    if (["mp4", "mov", "avi"].includes(ext)) return <Film size={40} />;
    return <FileText size={40} />;
  };

  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />
    </div>
  );

  return (
    <div className="pt-20 min-h-screen relative bg-black">
      {/* Background layer */}
        <div
          className="h-full w-full absolute inset-0 bg-cover bg-center filter opacity-50"
          style={{ backgroundImage: `url(${c1})` }}
        />
      {/* Foreground Content */}
      <div className="relative text-white p-4 sm:px-8 lg:px-16">
        <div className="mb-6 px-8 flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-gray-400 bg-transparent px-4 py-2 rounded-full w-full text-base
                      transition-shadow duration-200 ease-in-out
                      focus:outline-none hover:shadow-[0_0_20px_6px_rgba(156,163,175,0.6)]"
          />
          <button className="border-2 hover:bg-gray-700 text-white p-3 rounded-full transition">
            <Search size={18} />
          </button>
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {loading ? (
          <div className="text-center text-lg font-medium">Loading...</div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Your Files</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {files
                .filter((file) =>
                  file.filename.toLowerCase().includes(search.toLowerCase())
                )
                .map((file) => (
                  <div
                    key={file._id}
                    className="border-2 border-gray-400 p-5 transition flex flex-col items-center text-center
                                transition-all duration-200 transition-shadow duration-200 ease-in-out
                                hover:shadow-[0_0_20px_6px_rgba(156,163,175,0.6)]"
                  >
                    <div className="border-2 border-gray-400 p-4 h-16 w-16 flex items-center justify-center rounded-full mb-4 transition">
                      {getIcon(file.filename)}
                    </div>

                    <span className="font-semibold text-white">{file.filename}</span>
                    {file.compressed && <span className="text-yellow-600 text-sm">Compressed</span>}
                    {file.encrypted && <span className="text-red-600 text-sm">Encrypted</span>}

                    {(downloadingFile === file._id || previewingFile === file._id || deletingFile === file._id || compressingFile === file._id || encryptingFile === file._id) && (
                      <span className="text-sm text-gray-600 mt-1">
                        {downloadingFile === file._id && "Downloading..."}
                        {previewingFile === file._id && "Opening preview..."}
                        {deletingFile === file._id && "Deleting..."}
                        {compressingFile === file._id && (file.compressed ? "Decompressing..." : "Compressing...")}
                        {encryptingFile === file._id && (file.encrypted ? "Decrypting..." : "Encrypting...")}
                      </span>
                    )}

                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {/* Preview */}
                      <button
                        onClick={() => handlePreview(file)}
                        className="bg-gray-700 border-2 hover:bg-transparent text-white p-2 rounded-full relative transition"
                        disabled={processing && activeFile === file._id}
                      >
                        {previewingFile === file._id ? <LoadingSpinner /> : <Eye size={20} />}
                      </button>

                      {/* Download */}
                      <button
                        onClick={() => handleDownload(file)}
                        className="bg-green-700 border-2 hover:bg-transparent text-white p-2 rounded-full relative transition"
                        disabled={processing && activeFile === file._id}
                      >
                        {downloadingFile === file._id ? <LoadingSpinner /> : <Download size={20} />}
                      </button>

                      {/* Compress */}
                      <button
                        onClick={() => handleCompression(file)}
                        className={`${file.compressed ? "bg-yellow-500" : "bg-blue-700"} border-2 hover:bg-transparent text-white p-2 rounded-full relative transition`}
                        disabled={processing && activeFile === file._id}
                      >
                        {compressingFile === file._id ? <LoadingSpinner /> : <FileArchive size={20} />}
                      </button>

                      {/* Encrypt */}
                      <button
                        onClick={() => handleEncryption(file)}
                        className={`${file.encrypted ? "bg-blue-500" : "bg-orange-700"} border-2 hover:bg-transparent text-white p-2 rounded-full relative transition`}
                        disabled={processing && activeFile === file._id}
                      >
                        {encryptingFile === file._id ? <LoadingSpinner /> : file.encrypted ? <Unlock size={20} /> : <Lock size={20} />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(file._id)}
                        className="bg-red-700 border-2 hover:bg-transparent text-white p-2 rounded-full relative transition"
                        disabled={processing && activeFile === file._id}
                      >
                        {deletingFile === file._id ? <LoadingSpinner /> : <Trash2 size={20} />}
                      </button>

                      {/* Share */}
                      <button
                        className="bg-purple-700 border-2 hover:bg-transparent text-white p-2 rounded-full relative transition"
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
    </div>
  );
};

export default FilesPage;
