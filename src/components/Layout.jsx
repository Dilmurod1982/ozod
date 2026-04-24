// src/components/Layout.jsx
import React from "react";
import TopMenu from "./TopMenu";
import Sidebar from "./Sidebar";
import useSidebarStore from "../store/sidebarStore";
import useIdleLogout from "../hooks/useIdleLogout";

const Layout = ({ children }) => {
  useIdleLogout(3); // 3 минуты неактивности
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <TopMenu />
      <div className="flex">
        <Sidebar />
        <main
          className={`flex-1 p-6 mt-16 transition-all duration-300 ${
            isCollapsed ? "ml-20" : "ml-64"
          }`}
        >
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 shadow-2xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
