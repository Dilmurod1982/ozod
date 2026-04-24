// src/components/GasData/GasDataDetailsModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const GasDataDetailsModal = ({ open, onClose, data }) => {
  if (!data) return null;

  const byMeter =
    Number(data.totalGas || 0) -
    Number(data.lowPressure || 0) -
    Number(data.configError || 0) -
    Number(data.power || 0);

  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl w-full max-w-2xl mx-4 shadow-2xl border border-white/20"
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">
                Абонент маълумотлари
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Абонент номи</p>
                  <p className="text-white font-medium">
                    {data.subscriberName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">АГТКШ рақами</p>
                  <p className="text-white">{data.agtkshNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Йил</p>
                  <p className="text-white">{data.year}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Ой</p>
                  <p className="text-white">{months[data.month - 1]}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h4 className="text-cyan-400 font-semibold mb-3">
                  Газ кўрсаткичлари
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-400 text-sm">Жами газ</p>
                    <p className="text-white">
                      {Number(data.totalGas).toLocaleString()} м³
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Ҳисоблагич бўйича</p>
                    <p className="text-cyan-300 font-medium">
                      {byMeter.toLocaleString()} м³
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Паст босим</p>
                    <p className="text-white">
                      {Number(data.lowPressure).toLocaleString()} м³
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Хатолик</p>
                    <p className="text-white">
                      {Number(data.configError).toLocaleString()} м³
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Қувват бўйича</p>
                    <p className="text-white">
                      {Number(data.power).toLocaleString()} м³
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GasDataDetailsModal;
