// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useSidebarStore from "../store/sidebarStore";
import {
  Users,
  Database,
  Printer,
  ChevronLeft,
  ChevronRight,
  Building2,
  Info,
  PlusCircle,
  Eye,
  Cpu,
  Activity,
} from "lucide-react";

const Sidebar = () => {
  const { role } = useAuthStore();
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  const menuItems = [
    {
      path: "/main-info",
      icon: Info,
      label: "Асосий маълумотлар",
      allowedRoles: ["admin", "user"],
    },
    {
      path: "/subscribers",
      icon: Building2,
      label: "Абонентлар",
      allowedRoles: ["admin", "user"],
    },
    {
      path: "/meters",
      icon: Cpu,
      label: "Ҳисоблагичлар",
      allowedRoles: ["admin", "user"],
    },
    {
      path: "/data-entry",
      icon: PlusCircle,
      label: "Ввод данных",
      allowedRoles: ["admin", "user"],
    },
    {
      path: "/gas-data-view",
      icon: Eye,
      label: "Просмотр данных",
      allowedRoles: ["admin", "user"],
    },
    ...(role === "admin"
      ? [
          {
            path: "/users",
            icon: Users,
            label: "Фойдаланувчилар",
            allowedRoles: ["admin"],
          },
        ]
      : []),
    {
      path: "/print-act",
      icon: Printer,
      label: "Акт чоп этиш",
      allowedRoles: ["admin", "user"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.allowedRoles.includes(role),
  );

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed left-64 top-24 z-50 p-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
        style={{ left: isCollapsed ? "64px" : "256px" }}
      >
        {isCollapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>

      <div
        className={`fixed left-0 top-16 bottom-0 backdrop-blur-xl bg-black/30 border-r border-white/10 transition-all duration-300 z-40 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="p-4 space-y-2">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300"
                    : "text-gray-300 hover:bg-white/5"
                } ${isCollapsed ? "justify-center" : ""}`
              }
              title={isCollapsed ? item.label : ""}
            >
              <item.icon className="w-5 h-5 min-w-[20px]" />
              {!isCollapsed && <span>{item.label}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
