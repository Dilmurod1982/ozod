// src/components/FloatingMenuButton.jsx
import React from "react";
import useSidebarStore from "../store/sidebarStore";
import { Menu, ChevronLeft } from "lucide-react";

const FloatingMenuButton = () => {
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  return (
    <button
      onClick={toggleSidebar}
      className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 lg:hidden"
    >
      {isCollapsed ? (
        <Menu className="w-6 h-6" />
      ) : (
        <ChevronLeft className="w-6 h-6" />
      )}
    </button>
  );
};

export default FloatingMenuButton;
