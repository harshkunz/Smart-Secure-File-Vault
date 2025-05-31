import { useState, useContext } from "react";
import { UserData } from '../context/UserContext';
import cloud from "../assets/cloud.jpg";
import { RiEditLine } from "react-icons/ri";
import { TiTickOutline } from "react-icons/ti";
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
    <div className="pt-20 min-h-screen relative bg-black">
      {/* Background layer */}
      <div
        className="h-full w-full absolute inset-0 bg-cover bg-center filter opacity-30"
        style={{ backgroundImage: `url(${cloud})` }}
      />

      {/* Foreground Content */}
      <div className="relative py-10 w-full max-w-screen-lg mx-auto px-5 sm:px-32 md:px-46 lg:px-64">
        <div className="text-white items-center text-center">
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-medium mb-2 pt-12">
            Profile
          </h2>
          <h3 className="text-base sm:text-lg md:text-lg text-gray-300 mb-6 pb-4">
            View or edit your details
          </h3>
        </div>

        {/* Profile Card */}
        <div className="border-2 border-gray-400 py-6 px-2 pt-8 text-center space-y-6 transition-all duration-200 bg-black bg-opacity-50 transition-shadow duration-200 ease-in-out hover:shadow-[0_0_20px_6px_rgba(156,163,175,0.6)] w-full max-w-md mx-auto">

          {error && <p className="text-red-400 text-center text-sm">{error}</p>}
          {success && <p className="text-green-500 text-center text-sm">{success}</p>}

          {!User ? (
            <p className="text-center text-red-400 text-sm">Please login to view profile</p>
          ) : (
            <div className="space-y-4 text-white">
              <div className="flex items-center gap-8 px-4">
                <span className="text-gray-300 font-medium w-24">Name</span>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={editableUser.name}
                    onChange={handleChange}
                    className="border-b border-gray-500 focus:border-white bg-transparent text-white focus:outline-none hover:bg-white hover:bg-opacity-20 max-w-xs py-1 pl-3"
                  />
                ) : (
                  <span>{User.name}</span>
                )}
              </div>

              <div className="flex items-center gap-8 px-4">
                <span className="text-gray-300 font-medium w-24">Email</span>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={editableUser.email}
                    onChange={handleChange}
                    className="border-b border-gray-500 focus:border-white bg-transparent text-white focus:outline-none hover:bg-white hover:bg-opacity-20 max-w-xs py-1 pl-3"
                  />
                ) : (
                  <span>{User.email}</span>
                )}
              </div>

              <div className="flex items-center gap-8 px-4">
                <span className="text-gray-300 font-medium w-24">Joined at</span>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={new Date(User.createdAt).toLocaleDateString()}
                    className="border-b border-gray-500 focus:border-white bg-transparent text-white focus:outline-none hover:bg-white hover:bg-opacity-20 max-w-xs py-1 pl-3"
                  />
                ) : (
                  <span>{new Date(User.createdAt).toLocaleDateString()}</span>
                )}
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={editMode ? handleSave : () => setEditMode(true)}
                  className="flex items-center border gap-2 hover:bg-white hover:text-black text-white px-6 py-2 transition"
                >
                  {!editMode ? <RiEditLine size={20}/> : ""}
                  {editMode ? "Save" : "Edit"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
