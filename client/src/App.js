import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Gesture from "./pages/GestureDetection"; 
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext, useEffect } from "react";
import axios from "axios";

// Private Route wrapper
function PrivateRoute({ children }) {
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      axios
        .get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, [user, setUser]);

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Route */}
          <Route
            path="/gesture"
            element={
              <PrivateRoute>
                <Gesture />
              </PrivateRoute>
            }
          />

          {/* Fallback for undefined routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
