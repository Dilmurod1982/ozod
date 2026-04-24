// src/hooks/useIdleTimeout.js
import { useEffect, useRef, useState } from "react";
import useAuthStore from "../store/authStore";

const useIdleTimeout = (timeoutMinutes = 3) => {
  const { logout } = useAuthStore();
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const resetTimer = () => {
    // Очищаем все таймеры
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setShowWarning(false);
    setTimeLeft(0);

    // Устанавливаем таймер предупреждения (за 30 секунд до выхода)
    warningTimeoutRef.current = setTimeout(
      () => {
        setShowWarning(true);
        let remaining = 30;
        setTimeLeft(remaining);

        // Запускаем обратный отсчет
        intervalRef.current = setInterval(() => {
          remaining--;
          setTimeLeft(remaining);

          if (remaining <= 0) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }, 1000);

        // Устанавливаем таймер выхода
        timeoutRef.current = setTimeout(() => {
          console.log("Автоматический выход по неактивности");
          logout();
          window.location.href = "/login";
        }, 30000); // 30 секунд
      },
      timeoutMinutes * 60 * 1000 - 30000,
    ); // За 30 секунд до конца
  };

  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "keydown",
      "wheel",
      "touchmove",
    ];

    const handleActivity = () => {
      resetTimer();
    };

    // Добавляем слушатели событий
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Запускаем таймер
    resetTimer();

    // Очищаем при размонтировании
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [logout]);

  return { showWarning, timeLeft };
};

export default useIdleTimeout;
