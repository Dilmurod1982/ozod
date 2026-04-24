import React from "react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { Users, Database, Printer, UserCircle, FileText } from "lucide-react";

const Sidebar = () => {
  const { role } = useAuthStore();

  const menuItems = [
    ...(role === "admin"
      ? [{ path: "/users", icon: Users, label: "Фойдаланувчилар" }]
      : []),
    { path: "/data-entry", icon: Database, label: "Маълумотлар" },
    { path: "/print-act", icon: Printer, label: "Акт чоп этиш" },
  ];

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 backdrop-blur-xl bg-black/30 border-r border-white/10">
      <div className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300"
                  : "text-gray-300 hover:bg-white/5"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
