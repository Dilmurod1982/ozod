// src/pages/GasDataView.jsx
import React, { useState } from "react";
import { db, collection, getDocs } from "../firebase";
import { Search, Filter } from "lucide-react";

const GasDataView = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [filteredData, setFilteredData] = useState([]);
  const [showData, setShowData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i,
  );

  const months = [
    { value: 1, name: "Январь" },
    { value: 2, name: "Февраль" },
    { value: 3, name: "Март" },
    { value: 4, name: "Апрель" },
    { value: 5, name: "Май" },
    { value: 6, name: "Июнь" },
    { value: 7, name: "Июль" },
    { value: 8, name: "Август" },
    { value: 9, name: "Сентябрь" },
    { value: 10, name: "Октябрь" },
    { value: 11, name: "Ноябрь" },
    { value: 12, name: "Декабрь" },
  ];

  const filterData = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "gasData"));
      const allData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = allData.filter((item) => {
        return item.year === selectedYear && item.month === selectedMonth;
      });

      const processedData = filtered.map((item) => ({
        ...item,
        byMeter:
          Number(item.totalGas || 0) -
          Number(item.lowPressure || 0) -
          Number(item.configError || 0) -
          Number(item.power || 0),
      }));

      setFilteredData(processedData);
      setShowData(true);
    } catch (error) {
      console.error("Ошибка:", error);
      setError("Маълумотларни юклашда хатолик: " + error.message);
      alert("Хатолик: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        Просмотр данных газовых счетчиков
      </h2>

      {/* Фильтры */}
      <div className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Фильтрлар</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Йил:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Ой:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={filterData}
              disabled={loading}
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Search className="inline w-4 h-4 mr-2" />
              {loading ? "Қидириш..." : "Қидириш"}
            </button>
          </div>
        </div>
      </div>

      {/* Таблица с данными */}
      {showData && (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">
            {selectedYear} йил{" "}
            {months.find((m) => m.value === selectedMonth)?.name} ойи учун
            маълумотлар
          </h3>

          {filteredData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Маълумот топилмади</p>
              <p className="text-gray-500 text-sm mt-2">
                "{selectedYear} йил{" "}
                {months.find((m) => m.value === selectedMonth)?.name}" ойи учун
                ҳеч қандай маълумот киритилмаган
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white text-sm">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="text-left py-3 px-2">№</th>
                    <th className="text-left py-3 px-2">Абонент номи</th>
                    <th className="text-left py-3 px-2">АГТКШ рақами</th>
                    <th className="text-right py-3 px-2">Жами газ</th>
                    <th className="text-right py-3 px-2">Ҳисоблагич бўйича</th>
                    <th className="text-right py-3 px-2">Паст босим</th>
                    <th className="text-right py-3 px-2">Хатолик</th>
                    <th className="text-right py-3 px-2">Қувват бўйича</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-2 px-2">{index + 1}</td>
                      <td className="py-2 px-2 font-medium">
                        {item.subscriberName || "-"}
                      </td>
                      <td className="py-2 px-2">{item.agtkshNumber || "-"}</td>
                      <td className="text-right py-2 px-2">
                        {Number(item.totalGas || 0).toLocaleString()} м³
                      </td>
                      <td className="text-right py-2 px-2 text-cyan-300 font-medium">
                        {Number(item.byMeter || 0).toLocaleString()} м³
                      </td>
                      <td className="text-right py-2 px-2">
                        {Number(item.lowPressure || 0).toLocaleString()} м³
                      </td>
                      <td className="text-right py-2 px-2">
                        {Number(item.configError || 0).toLocaleString()} м³
                      </td>
                      <td className="text-right py-2 px-2">
                        {Number(item.power || 0).toLocaleString()} м³
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-white/10 bg-white/5">
                  <tr className="font-semibold">
                    <td colSpan="3" className="py-3 px-2 text-right">
                      Жами:
                    </td>
                    <td className="text-right py-3 px-2">
                      {filteredData
                        .reduce(
                          (sum, item) => sum + Number(item.totalGas || 0),
                          0,
                        )
                        .toLocaleString()}{" "}
                      м³
                    </td>
                    <td className="text-right py-3 px-2 text-cyan-300">
                      {filteredData
                        .reduce(
                          (sum, item) => sum + Number(item.byMeter || 0),
                          0,
                        )
                        .toLocaleString()}{" "}
                      м³
                    </td>
                    <td className="text-right py-3 px-2">
                      {filteredData
                        .reduce(
                          (sum, item) => sum + Number(item.lowPressure || 0),
                          0,
                        )
                        .toLocaleString()}{" "}
                      м³
                    </td>
                    <td className="text-right py-3 px-2">
                      {filteredData
                        .reduce(
                          (sum, item) => sum + Number(item.configError || 0),
                          0,
                        )
                        .toLocaleString()}{" "}
                      м³
                    </td>
                    <td className="text-right py-3 px-2">
                      {filteredData
                        .reduce((sum, item) => sum + Number(item.power || 0), 0)
                        .toLocaleString()}{" "}
                      м³
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GasDataView;
