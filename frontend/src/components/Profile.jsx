import { useState, useContext } from "react";
import { UserData } from '../context/UserContext';
import axios from 'axios';

const BASE_URL = "http://localhost:5000";

const Profile = () => {
  const { user: User, setUser: setUser } = useContext(UserData);
  const [editMode, setEditMode] = useState(false);
  const [editableUser, setEditableUser] = useState({
    name: User?.name || "",
    email: User?.email || ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`${BASE_URL}/user/profile`, {
        name: editableUser.name,
        email: editableUser.email,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });

      setUser(res.data.data);
      setEditableUser(res.data.data);
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

        {!User ? (
          <p className="text-center text-red-500">Please login to view profile</p>
        ) : (
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
                <span className="text-gray-900">{User.name}</span>
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
                <span className="text-gray-900">{User.email}</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium w-24">Registered:</span>
              <span className="text-gray-900">
                {new Date(User.createdAt).toLocaleDateString()}
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
        )}
      </div>
    </div>
  );
};

export default Profile;
