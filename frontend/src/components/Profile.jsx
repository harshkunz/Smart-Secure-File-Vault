import { useEffect, useState } from "react";
import api from "../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editableUser, setEditableUser] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");

        if (res.status == 200) {
          const { name, email } = res.data;
          setUser(res.data);
          setEditableUser({ name, email });
        }

      } catch (err) {
        setError("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await api.put("/auth/profile", {
        name: editableUser.name,
        email: editableUser.email,
      });

      setUser(res.data);
      setEditableUser(res.data); // Update editableUser with the new data 
      setEditMode(false);
      setSuccess("Profile updated!");
      setTimeout(() => setSuccess(""), 2000);

    } catch (err) {
      setError(err.response?.data?.msg || "Update failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Profile</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

        {user ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium w-24">Name:</span>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={editableUser.name}
                  onChange={handleChange}
                  className="border px-2 py-1 rounded-sm w-full max-w-xs"
                />
              ) : (
                <span className="text-gray-900">{user.name}</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium w-24">Email:</span>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={editableUser.email}
                  onChange={handleChange}
                  className="border px-2 py-1 rounded-sm w-full max-w-xs"
                />
              ) : (
                <span className="text-gray-900">{user.email}</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium w-24">Registered:</span>
              <span className="text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>

            {editMode ? (
              <div className="flex justify-center mt-6">
                  <button
                  onClick={handleSave}
                  className="bg-green-500 text-white py-2 px-12 rounded-sm hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-green-500 text-white py-2 px-12 rounded-sm hover:bg-blue-700"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ) : (
          !error && <p className="text-center text-gray-600">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;