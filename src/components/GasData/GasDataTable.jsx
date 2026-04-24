// src/components/GasData/GasDataTable.jsx
import React from "react";
import { motion } from "framer-motion";

const GasDataTable = ({ data, onRowClick, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
        <p className="text-gray-400">Маълумот топилмади</p>
        <p className="text-gray-500 text-sm mt-2">
          Танланган давр учун ҳеч қандай маълумот киритилмаган
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-white text-sm">
        <thead className="border-b border-white/10 bg-white/5">
          <tr>
            <th className="text-left py-3 px-3">№</th>
            <th className="text-left py-3 px-3">Абонент номи</th>
            <th className="text-left py-3 px-3">АГТКШ рақами</th>
            <th className="text-right py-3 px-3">Жами газ</th>
            <th className="text-right py-3 px-3">Ҳисоблагич бўйича</th>
            <th className="text-right py-3 px-3">Паст босим</th>
            <th className="text-right py-3 px-3">Хатолик</th>
            <th className="text-right py-3 px-3">Қувват бўйича</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onRowClick && onRowClick(item)}
              className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <td className="py-3 px-3">{index + 1}</td>
              <td className="py-3 px-3 font-medium">
                {item.subscriberName || "-"}
              </td>
              <td className="py-3 px-3">{item.agtkshNumber || "-"}</td>
              <td className="text-right py-3 px-3">
                {Number(item.totalGas || 0).toLocaleString()} м³
              </td>
              <td className="text-right py-3 px-3 text-cyan-300 font-medium">
                {Number(item.byMeter || 0).toLocaleString()} м³
              </td>
              <td className="text-right py-3 px-3">
                {Number(item.lowPressure || 0).toLocaleString()} м³
              </td>
              <td className="text-right py-3 px-3">
                {Number(item.configError || 0).toLocaleString()} м³
              </td>
              <td className="text-right py-3 px-3">
                {Number(item.power || 0).toLocaleString()} м³
              </td>
            </motion.tr>
          ))}
        </tbody>
        <tfoot className="border-t border-white/10 bg-white/5">
          <tr className="font-semibold">
            <td colSpan="3" className="py-3 px-3 text-right">
              Жами:
            </td>
            <td className="text-right py-3 px-3">
              {data
                .reduce((sum, item) => sum + Number(item.totalGas || 0), 0)
                .toLocaleString()}{" "}
              м³
            </td>
            <td className="text-right py-3 px-3 text-cyan-300">
              {data
                .reduce((sum, item) => sum + Number(item.byMeter || 0), 0)
                .toLocaleString()}{" "}
              м³
            </td>
            <td className="text-right py-3 px-3">
              {data
                .reduce((sum, item) => sum + Number(item.lowPressure || 0), 0)
                .toLocaleString()}{" "}
              м³
            </td>
            <td className="text-right py-3 px-3">
              {data
                .reduce((sum, item) => sum + Number(item.configError || 0), 0)
                .toLocaleString()}{" "}
              м³
            </td>
            <td className="text-right py-3 px-3">
              {data
                .reduce((sum, item) => sum + Number(item.power || 0), 0)
                .toLocaleString()}{" "}
              м³
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default GasDataTable;
