// src/hooks/useIdleLogout.js
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const useIdleLogout = (timeoutMinutes = 3) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const logoutUser = () => {
    console.log("Автоматический выход по неактивности");
    logout();
    navigate("/login");
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(logoutUser, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];

    const handleUserActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);
};

export default useIdleLogout;
