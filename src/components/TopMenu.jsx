import React, { useState } from "react";
import useAuthStore from "../store/authStore";
import { LogOut, User, Settings, Sparkles } from "lucide-react";

const TopMenu = () => {
  const { user, logout, role } = useAuthStore();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Ҳудудгаз Фарғона
          </h1>
          <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {role === "admin" ? "Админ" : "Фойдаланувчи"}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm">{user?.email}</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 backdrop-blur-xl bg-black/80 rounded-xl border border-white/10 shadow-2xl">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Чиқиш</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopMenu;
