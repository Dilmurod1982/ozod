// src/pages/DataEntry.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db, collection, getDocs, addDoc, updateDoc, doc } from "../firebase";
import { Edit2, Plus, X, Save } from "lucide-react";

const DataEntry = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [gasData, setGasData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDataEntry, setShowDataEntry] = useState(false);
  const [editingMonth, setEditingMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [tableData, setTableData] = useState([]);
  const [saving, setSaving] = useState(false);

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

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i,
  );

  // Загрузка абонентов и данных
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Загрузка абонентов
      const subscribersSnapshot = await getDocs(collection(db, "subscribers"));
      const subscribersList = subscribersSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((s) => s.status === "active");
      setSubscribers(subscribersList);

      // Загрузка данных газовых счетчиков
      const gasDataSnapshot = await getDocs(collection(db, "gasData"));
      const gasDataList = gasDataSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGasData(gasDataList);
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Хатолик: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Получение списка месяцев с данными
  const getMonthsWithData = () => {
    const monthsMap = new Map();

    gasData.forEach((item) => {
      const key = `${item.year}-${item.month}`;
      if (!monthsMap.has(key)) {
        monthsMap.set(key, {
          year: item.year,
          month: item.month,
          monthName: months[item.month - 1],
          count: 0,
        });
      }
      monthsMap.get(key).count++;
    });

    return Array.from(monthsMap.values()).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  };

  // Открытие формы ввода для выбранного месяца
  const openDataEntry = (year, month, isEditing = false) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setEditingMonth(isEditing ? { year, month } : null);

    // Подготовка данных таблицы
    const existingDataMap = new Map();
    if (isEditing) {
      const monthData = gasData.filter(
        (item) => item.year === year && item.month === month,
      );
      monthData.forEach((item) => {
        existingDataMap.set(item.subscriberId, item);
      });
    }

    const tableRows = subscribers.map((subscriber, index) => {
      const existing = existingDataMap.get(subscriber.id);
      return {
        id: subscriber.id,
        index: index + 1,
        subscriberName: subscriber.companyName,
        agtkshNumber: subscriber.agtkshNumber || "",
        totalGas: existing?.totalGas || 0,
        configError: existing?.configError || 0,
        lowPressure: existing?.lowPressure || 0,
        power: existing?.power || 0,
        existingId: existing?.id || null,
      };
    });

    setTableData(tableRows);
    setShowDataEntry(true);
  };

  // Обновление значения в таблице
  const updateTableValue = (id, field, value) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: Number(value) || 0 } : row,
      ),
    );
  };

  // Расчет "по счетчику"
  const calculateByMeter = (row) => {
    return (
      (row.totalGas || 0) -
      (row.configError || 0) -
      (row.lowPressure || 0) -
      (row.power || 0)
    );
  };

  // Сохранение всех данных
  const saveAllData = async () => {
    setSaving(true);
    try {
      for (const row of tableData) {
        const dataToSave = {
          subscriberId: row.id,
          subscriberName: row.subscriberName,
          agtkshNumber: row.agtkshNumber,
          totalGas: Number(row.totalGas) || 0,
          configError: Number(row.configError) || 0,
          lowPressure: Number(row.lowPressure) || 0,
          power: Number(row.power) || 0,
          month: selectedMonth,
          year: selectedYear,
          updatedAt: new Date(),
        };

        if (row.existingId) {
          // Обновление существующей записи
          const recordRef = doc(db, "gasData", row.existingId);
          await updateDoc(recordRef, dataToSave);
        } else if (
          row.totalGas > 0 ||
          row.configError > 0 ||
          row.lowPressure > 0 ||
          row.power > 0
        ) {
          // Добавление новой записи (только если есть данные)
          dataToSave.createdAt = new Date();
          await addDoc(collection(db, "gasData"), dataToSave);
        }
      }

      alert("Маълумотлар муваффақиятли сақланди!");
      await loadData(); // Перезагрузка данных
      setShowDataEntry(false);
      setEditingMonth(null);
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Хатолик: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const monthsWithData = getMonthsWithData();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-white">
          Газ ҳисоботлари (Электрон ҳисоблагичлар)
        </h2>

        <motion.button
          onClick={() => openDataEntry(selectedYear, selectedMonth, false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Янги маълумот киритиш
        </motion.button>
      </div>

      {/* Список месяцев с данными */}
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Киритилган маълумотлар рўйхати
        </h3>

        {monthsWithData.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Ҳеч қандай маълумот киритилмаган
          </p>
        ) : (
          <div className="space-y-3">
            {monthsWithData.map((item) => (
              <div
                key={`${item.year}-${item.month}`}
                className="flex justify-between items-center p-4 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition-all"
              >
                <div>
                  <p className="text-white font-medium text-lg">
                    {item.monthName} {item.year}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {item.count} та абонент
                  </p>
                </div>
                <button
                  onClick={() => openDataEntry(item.year, item.month, true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  Таҳрирлаш
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно для ввода/редактирования данных */}
      <AnimatePresence>
        {showDataEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl w-full max-w-7xl mx-4 shadow-2xl border border-white/20"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">
                  {editingMonth
                    ? "Маълумотларни таҳрирлаш"
                    : "Янги маълумот киритиш"}{" "}
                  - {months[selectedMonth - 1]} {selectedYear}
                </h3>
                <button
                  onClick={() => setShowDataEntry(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="overflow-x-auto max-h-[60vh]">
                  <table className="w-full text-white text-sm">
                    <thead className="border-b border-white/10 bg-white/5 sticky top-0">
                      <tr>
                        <th className="text-left py-3 px-2">№</th>
                        <th className="text-left py-3 px-2">Название МЧЖ</th>
                        <th className="text-left py-3 px-2">Номер АГТКШ</th>
                        <th className="text-right py-3 px-2">Всего газ</th>
                        <th className="text-right py-3 px-2">
                          В том числе по счетчику
                        </th>
                        <th className="text-right py-3 px-2">
                          Ошибка конфигурации п.6.2.1.1
                        </th>
                        <th className="text-right py-3 px-2">
                          Низкий перепад давления п.6.2.7
                        </th>
                        <th className="text-right py-3 px-2">По мощности</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-white/5 hover:bg-white/5"
                        >
                          <td className="py-2 px-2">{row.index}</td>
                          <td className="py-2 px-2 font-medium">
                            {row.subscriberName}
                          </td>
                          <td className="py-2 px-2">{row.agtkshNumber}</td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              value={row.totalGas}
                              onChange={(e) =>
                                updateTableValue(
                                  row.id,
                                  "totalGas",
                                  e.target.value,
                                )
                              }
                              className="w-28 px-2 py-1 rounded bg-white/10 border border-white/10 text-white text-right focus:outline-none focus:border-cyan-500"
                              placeholder="0"
                            />
                          </td>
                          <td className="text-right py-2 px-2 text-cyan-300 font-medium">
                            {calculateByMeter(row).toLocaleString()} м³
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              value={row.configError}
                              onChange={(e) =>
                                updateTableValue(
                                  row.id,
                                  "configError",
                                  e.target.value,
                                )
                              }
                              className="w-28 px-2 py-1 rounded bg-white/10 border border-white/10 text-white text-right focus:outline-none focus:border-cyan-500"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              value={row.lowPressure}
                              onChange={(e) =>
                                updateTableValue(
                                  row.id,
                                  "lowPressure",
                                  e.target.value,
                                )
                              }
                              className="w-28 px-2 py-1 rounded bg-white/10 border border-white/10 text-white text-right focus:outline-none focus:border-cyan-500"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              value={row.power}
                              onChange={(e) =>
                                updateTableValue(
                                  row.id,
                                  "power",
                                  e.target.value,
                                )
                              }
                              className="w-28 px-2 py-1 rounded bg-white/10 border border-white/10 text-white text-right focus:outline-none focus:border-cyan-500"
                              placeholder="0"
                            />
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
                          {tableData
                            .reduce((sum, row) => sum + (row.totalGas || 0), 0)
                            .toLocaleString()}{" "}
                          м³
                        </td>
                        <td className="text-right py-3 px-2 text-cyan-300">
                          {tableData
                            .reduce(
                              (sum, row) => sum + calculateByMeter(row),
                              0,
                            )
                            .toLocaleString()}{" "}
                          м³
                        </td>
                        <td className="text-right py-3 px-2">
                          {tableData
                            .reduce(
                              (sum, row) => sum + (row.configError || 0),
                              0,
                            )
                            .toLocaleString()}{" "}
                          м³
                        </td>
                        <td className="text-right py-3 px-2">
                          {tableData
                            .reduce(
                              (sum, row) => sum + (row.lowPressure || 0),
                              0,
                            )
                            .toLocaleString()}{" "}
                          м³
                        </td>
                        <td className="text-right py-3 px-2">
                          {tableData
                            .reduce((sum, row) => sum + (row.power || 0), 0)
                            .toLocaleString()}{" "}
                          м³
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="flex gap-3 pt-6 mt-4 border-t border-white/10">
                  <button
                    onClick={saveAllData}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? "Сақланапти..." : "Сақлаш"}
                  </button>
                  <button
                    onClick={() => setShowDataEntry(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all font-semibold"
                  >
                    Бекор қилиш
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DataEntry;
