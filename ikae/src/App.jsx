import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Editor from "./pages/Editor";
import Login from "./pages/Login";
import Signup from "./components/Auth/Signup";
import DashboardPage from "./pages/Dashboard";
import DesignStudioPage from "./pages/Studio";
import UserProfileSettingsPage from "./pages/Profile";
import HelpDocumentationPage from "./pages/Help";
import ErrorPage from "./pages/Error";
import RoomDesigner from "./pages/Room";
import RegisterPage from "./pages/Register";
import RoomEditor from "./scenes/RoomEditor/RoomEditor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<RoomEditor />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shop" element={<Shop />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Designer Tools Routes */}
        <Route path="/editor" element={<Editor />} />
        <Route path="/studio" element={<DesignStudioPage />} />
        <Route path="/room" element={<RoomDesigner />} />

        {/* User Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<UserProfileSettingsPage />} />
        <Route path="/help" element={<HelpDocumentationPage />} />

        {/* Error Handling */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
