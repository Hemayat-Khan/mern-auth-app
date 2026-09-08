import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./redux/authSlice";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import Dashboard from "./Components/Dashboard";

// We created ProtectedRoute right here inside App.jsx
const ProtectedRoute = ({ children }) => {
  const { user, initialized } = useSelector((state) => state.auth);

  // 1. Show loading while checking cookie/token
  if (!initialized) {
    return <div></div>;
  }

  // 2. Once finished, if user exists show Dashboard, otherwise go to Login
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;