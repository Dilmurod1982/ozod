import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import Login from "./pages/Login";
import Users from "./pages/Users";
import DataEntry from "./pages/DataEntry";
import PrintAct from "./pages/PrintAct";
import Layout from "./components/Layout";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, role } = useAuthStore();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && role !== "admin") return <Navigate to="/data-entry" />;
  return children;
};

function App() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/users"
            element={
              <PrivateRoute adminOnly>
                <Users />
              </PrivateRoute>
            }
          />
          <Route path="/data-entry" element={<DataEntry />} />
          <Route path="/print-act" element={<PrintAct />} />
          <Route path="/" element={<Navigate to="/data-entry" />} />
          <Route path="/login" element={<Navigate to="/data-entry" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
