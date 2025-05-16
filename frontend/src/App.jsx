import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import FilesPage from "./pages/FilesPage";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Upload from "./components/Upload";
import Navbar from './components/Navbar';

const App = () => {
  
  return (
      <Router>
        <Navbar/>
        <Routes>
          {/* Ui checking routes */}
          <Route path="/ui" element={<Upload />} />

          {/* Public Routes */}
          <Route path="/" element={<DashBoard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes (you can later wrap them in auth logic) */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/files" element={<FilesPage />} />
        </Routes>
      </Router>
  );
};

export default App;
