// src/components/IdleTimer.jsx
import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";

const IdleTimer = ({ timeoutMinutes = 3 }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    let warningTimer;
    let countdownInterval;

    const resetTimers = () => {
      if (warningTimer) clearTimeout(warningTimer);
      if (countdownInterval) clearInterval(countdownInterval);
      setShowWarning(false);
      setTimeLeft(null);

      // Показываем предупреждение за 30 секунд до выхода
      warningTimer = setTimeout(
        () => {
          setShowWarning(true);
          let remaining = 30;
          setTimeLeft(remaining);

          countdownInterval = setInterval(() => {
            remaining--;
            setTimeLeft(remaining);
            if (remaining <= 0) {
              clearInterval(countdownInterval);
            }
          }, 1000);
        },
        (timeoutMinutes * 60 - 30) * 1000,
      );
    };

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];
    const handleActivity = () => resetTimers();

    events.forEach((event) => window.addEventListener(event, handleActivity));
    resetTimers();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity),
      );
      if (warningTimer) clearTimeout(warningTimer);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [timeoutMinutes]);

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-500/20 to-red-500/20 border border-yellow-500/50 rounded-xl p-4 shadow-2xl animate-pulse">
        <div className="flex items-center gap-3">
          <div className="relative">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3">
              <div className="animate-ping absolute w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="relative w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <div>
            <p className="text-yellow-300 font-bold">Сеанс тугаяпти!</p>
            <p className="text-white text-sm">
              <Clock className="inline w-4 h-4 mr-1" />
              {timeLeft} сониядан сўнг автоматик чиқиш
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdleTimer;
