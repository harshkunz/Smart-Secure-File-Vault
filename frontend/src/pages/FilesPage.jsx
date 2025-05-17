import { useState } from "react";
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

const dummyFiles = [
  { id: 1, name: "report.pdf" },
  { id: 2, name: "image.png" },
  { id: 3, name: "video.mp4" },
];

export default function FilesPage() {
  const [files, setFiles] = useState(dummyFiles);
  const [search, setSearch] = useState("");

  const getIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (ext === "pdf") return <FileText size={40} />;
    if (["png", "jpg", "jpeg", "gif"].includes(ext)) return <Image size={40} />;
    if (["mp4", "mov", "avi"].includes(ext)) return <Film size={40} />;
    return <FileText size={40} />;
  };


  const handleDelete = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="mb-4 px-8 py-2 flex gap-2">
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-full w-full hover:bg-purple-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button
          onClick={() => {}} // Optional: trigger any custom search logic
          className="bg-green-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
        >
          <Search size={18} />
        </button>
      </div>
      <h2 className="text-2xl font-semibold text-center mb-4">User Files</h2>

      {/* Files List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-2">
        {files
          .filter((file) =>
            file.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((file) => (
            <div
              key={file.id}
              className="border rounded p-4 flex flex-col items-center text-center shadow rounded-lg hover:bg-purple-100"
            >
              <div className="border-2 p-8 h-16 mb-2 flex items-center justify-center rounded-full hover:bg-green-200">
                {getIcon(file.name)}
              </div>
              <span className="font-medium">{file.name}</span>
              <div className="flex gap-2 mt-4">
                <button className="bg-gray-300 mx-1 hover:bg-blue-600 text-black text-sm px-2 py-1 rounded-sm">
                  <Eye size={20} />
                </button>
                <button className="bg-green-500 mx-1 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded-sm">
                  <Download size={20} />
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
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
    </div>
  );
}
