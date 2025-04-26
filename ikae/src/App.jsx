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
import HomePage from "./pages/Home";
import ProductsPage from "./pages/Products";
import ProductDetailsPage from "./pages/Details";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoomEditor />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/signup" element={<Signup />} />
        // GM's Shiat
        <Route path="*" element={<ErrorPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/studio" element={<DesignStudioPage />} />
        <Route path="/room" element={<RoomDesigner />} />
        <Route path="/profile" element={<UserProfileSettingsPage />} />
        <Route path="/help" element={<HelpDocumentationPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/details" element={<ProductDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
