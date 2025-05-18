import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import FilesPage from "./pages/FilesPage";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Upload from "./components/Upload";
import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
  
  return (
      <Router>
        <Navbar/>
        <Routes>
          {/* checking under-developing routes */}
          

          {/* Public Routes */}
          <Route path="/" element={<DashBoard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<Upload />} />

          {/* Protected Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/files" 
            element={
              <ProtectedRoute>
                <FilesPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
  );
};

export default App;
