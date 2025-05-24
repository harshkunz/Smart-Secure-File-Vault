import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserData);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : null;
};

export default ProtectedRoute;
