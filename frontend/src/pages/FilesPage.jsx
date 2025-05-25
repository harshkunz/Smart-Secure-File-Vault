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
                  {downloadingFile === file._id && (
                    <span className="text-sm text-green-600 mt-1">
                      Downloading...
                    </span>
                  )}
                  {previewingFile === file._id && (
                    <span className="text-sm text-gray-600 mt-1">
                      Opening preview...
                    </span>
                  )}
                  {deletingFile === file._id && (
                    <span className="text-sm text-red-600 mt-1">
                      Deleting...
                    </span>
                  )}
                  {compressingFile === file._id && (
                    <span className="text-sm text-yellow-600 mt-1">
                      {file.compressed ? 'Decompressing...' : 'Compressing...'}
                    </span>
                  )}
                  {encryptingFile === file._id && (
                    <span className="text-sm text-red-600 mt-1">
                      {file.encrypted ? 'Decrypting...' : 'Encrypting...'}
                    </span>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      className="bg-gray-300 mx-1 hover:bg-blue-600 text-black text-sm px-2 py-1 rounded-sm relative"
                      onClick={() => handlePreview(file)}
                      disabled={processing && activeFile === file._id}
                    >
                      {previewingFile === file._id ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600"></div>
                        </div>
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                    <button
                      className="bg-green-500 mx-1 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded-sm relative"
                      onClick={() => handleDownload(file)}
                      disabled={processing && activeFile === file._id}
                    >
                      {downloadingFile === file._id ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-green-500">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                        </div>
                      ) : (
                        <Download size={20} />
                      )}
                    </button>
                    {/* Compression button */}
                    <button
                      onClick={() => handleCompression(file)}
                      className={`mx-1 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded-sm relative ${
                        file.compressed ? 'bg-yellow-500' : 'bg-blue-300'
                      }`}
                      disabled={processing && activeFile === file._id}
                    >
                      {compressingFile === file._id ? (
                        <div className={`absolute inset-0 flex items-center justify-center ${
                          file.compressed ? 'bg-yellow-500' : 'bg-blue-300'
                        }`}>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                        </div>
                      ) : (
                        <FileArchive size={20} />
                      )}
                    </button>
                    {/* Encryption button */}
                    <button
                      onClick={() => handleEncryption(file)}
                      className={`mx-1 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded-sm relative ${
                        file.encrypted ? 'bg-blue-500' : 'bg-red-500'
                      }`}
                      disabled={processing && activeFile === file._id}
                    >
                      {encryptingFile === file._id ? (
                        <div className={`absolute inset-0 flex items-center justify-center ${
                          file.encrypted ? 'bg-blue-500' : 'bg-red-500'
                        }`}>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                        </div>
                      ) : (
                        file.encrypted ? <Unlock size={20} /> : <Lock size={20} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="bg-red-500 mx-1 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded-sm relative"
                      disabled={processing && activeFile === file._id}
                    >
                      {deletingFile === file._id ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-500">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                        </div>
                      ) : (
                        <Trash2 size={20} />
                      )}
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
