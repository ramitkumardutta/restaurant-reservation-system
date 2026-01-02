import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// public pages
import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Signup from "./pages/public/Signup";
import Menu from "./pages/public/Menu";

// user pages
import Reserve from "./pages/user/Reserve";
import History from "./pages/user/History";
import Orders from "./pages/user/Orders";
import ChangePassword from "./pages/user/ChangePassword";

// admin pages
import Dashboard from "./pages/admin/Dashboard";
import Tables from "./pages/admin/Tables";
import AdminOrders from "./pages/admin/Orders";
import MenuManage from "./pages/admin/MenuManage";

// components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"

function App() {
  return (
    <BrowserRouter>
      { <Navbar /> }

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* USER */}
        <Route
          path="/reserve"
          element={
            <ProtectedRoute roles={["customer"]}>
              <Reserve />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute roles={["customer"]}>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute roles={["customer"]}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute roles={["customer", "admin", "manager", "staff"]}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* ADMIN / STAFF */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin", "manager", "staff"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tables"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Tables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute roles={["admin", "manager", "staff"]}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <MenuManage />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {<Footer/>}
    </BrowserRouter>
  );
}

export default App;
