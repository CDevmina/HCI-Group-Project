import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Editor from "./pages/Editor";
import Login from "./pages/Login";
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
import CheckoutPage from "./pages/Checkout";
import OrderSuccessPage from "./pages/Confirmation";
import { AuthProvider } from "./components/Auth/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/room-editor" element={<RoomEditor />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/studio" element={<DesignStudioPage />} />
          <Route path="/room" element={<RoomDesigner />} />
          <Route path="/profile" element={<UserProfileSettingsPage />} />
          <Route path="/help" element={<HelpDocumentationPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/details" element={<ProductDetailsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />{" "}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirm" element={<OrderSuccessPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
