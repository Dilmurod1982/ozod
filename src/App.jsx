// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import useSidebarStore from "./store/sidebarStore";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Subscribers from "./pages/Subscribers";
import MainInfo from "./pages/MainInfo";
import DataEntry from "./pages/DataEntry";
import GasDataView from "./pages/GasDataView";
import PrintAct from "./pages/PrintAct";
import Layout from "./components/Layout";
import Meters from "./pages/Meters";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, role } = useAuthStore();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && role !== "admin") return <Navigate to="/data-entry" />;
  return children;
};

function App() {
  const { user, checkIdleOnLoad, updateLastActivity } = useAuthStore();
  const { setCollapsed } = useSidebarStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  useEffect(() => {
    const wasIdle = checkIdleOnLoad();
    if (wasIdle) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];
    const handleActivity = () => {
      if (user) {
        updateLastActivity();
      }
    };

    events.forEach((event) => window.addEventListener(event, handleActivity));

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity),
      );
    };
  }, [user, updateLastActivity]);

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
          <Route path="/main-info" element={<MainInfo />} />
          <Route path="/subscribers" element={<Subscribers />} />
          <Route path="/data-entry" element={<DataEntry />} />
          <Route path="/gas-data-view" element={<GasDataView />} />
          <Route
            path="/users"
            element={
              <PrivateRoute adminOnly>
                <Users />
              </PrivateRoute>
            }
          />
          <Route path="/print-act" element={<PrintAct />} />
          <Route path="/" element={<Navigate to="/main-info" />} />
          <Route path="/login" element={<Navigate to="/main-info" />} />
          <Route path="/meters" element={<Meters />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
