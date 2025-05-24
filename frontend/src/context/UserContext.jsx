import { createContext, useState, useEffect } from "react";

export const UserData = createContext();

const UserContext = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const setUser = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
    setUserState(userData);
  };

  return (
    <UserData.Provider value={{ user, setUser, loading }}>
      {children}
    </UserData.Provider>
  );
};

export default UserContext;
