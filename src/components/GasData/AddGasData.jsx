// src/components/GasData/AddGasData.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db, collection, addDoc, updateDoc, doc } from "../../firebase";
import { X, Save } from "lucide-react";

const AddGasData = ({
  open,
  onClose,
  subscribers,
  existingData,
  onSuccess,
}) => {
  const [selectedSubscriber, setSelectedSubscriber] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [formData, setFormData] = useState({
    totalGas: "",
    lowPressure: "",
    configError: "",
    power: "",
  });
  const [loading, setLoading] = useState(false);
  const [existingRecord, setExistingRecord] = useState(null);

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

  // Проверка существующих данных
  const checkExistingData = async (subscriberId) => {
    if (!subscriberId || !existingData) return;

    const existing = existingData.find(
      (item) =>
        item.subscriberId === subscriberId &&
        item.year === selectedYear &&
        item.month === selectedMonth,
    );

    if (existing) {
      setExistingRecord(existing);
      setFormData({
        totalGas: existing.totalGas || "",
        lowPressure: existing.lowPressure || "",
        configError: existing.configError || "",
        power: existing.power || "",
      });
    } else {
      setExistingRecord(null);
      setFormData({
        totalGas: "",
        lowPressure: "",
        configError: "",
        power: "",
      });
    }
  };

  React.useEffect(() => {
    if (selectedSubscriber) {
      checkExistingData(selectedSubscriber);
    }
  }, [selectedSubscriber, selectedYear, selectedMonth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubscriber) {
      alert("Абонент танланг!");
      return;
    }

    setLoading(true);
    try {
      const subscriber = subscribers.find((s) => s.id === selectedSubscriber);
      const dataToSave = {
        subscriberId: selectedSubscriber,
        subscriberName: subscriber?.companyName,
        agtkshNumber: subscriber?.agtkshNumber,
        totalGas: Number(formData.totalGas) || 0,
        lowPressure: Number(formData.lowPressure) || 0,
        configError: Number(formData.configError) || 0,
        power: Number(formData.power) || 0,
        month: selectedMonth,
        year: selectedYear,
        updatedAt: new Date(),
      };

      if (existingRecord) {
        // Обновляем существующую запись
        const recordRef = doc(db, "gasData", existingRecord.id);
        await updateDoc(recordRef, dataToSave);
        alert("Маълумотлар янгиланди!");
      } else {
        // Добавляем новую запись
        dataToSave.createdAt = new Date();
        await addDoc(collection(db, "gasData"), dataToSave);
        alert("Маълумотлар сақланди!");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Хатолик: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const byMeter =
    Number(formData.totalGas || 0) -
    Number(formData.lowPressure || 0) -
    Number(formData.configError || 0) -
    Number(formData.power || 0);

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
                {existingRecord
                  ? "Маълумотларни таҳрирлаш"
                  : "Янги маълумот киритиш"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-cyan-400 text-sm mb-1">
                  Абонент *
                </label>
                <select
                  value={selectedSubscriber}
                  onChange={(e) => setSelectedSubscriber(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white"
                  required
                >
                  <option value="">Абонент танланг</option>
                  {subscribers.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.companyName} ({sub.agtkshNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    Йил
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-cyan-400 text-sm mb-1">Ой</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white"
                  >
                    {months.map((month, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    Жами газ (м³)
                  </label>
                  <input
                    type="number"
                    value={formData.totalGas}
                    onChange={(e) =>
                      setFormData({ ...formData, totalGas: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    Низкий перепад давления п 6,2,7 (м³)
                  </label>
                  <input
                    type="number"
                    value={formData.lowPressure}
                    onChange={(e) =>
                      setFormData({ ...formData, lowPressure: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    Ошибка конфигурации п. 6,2,1,1 (м³)
                  </label>
                  <input
                    type="number"
                    value={formData.configError}
                    onChange={(e) =>
                      setFormData({ ...formData, configError: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    По мощности (м³)
                  </label>
                  <input
                    type="number"
                    value={formData.power}
                    onChange={(e) =>
                      setFormData({ ...formData, power: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl p-4 border border-cyan-500/30">
                <p className="text-cyan-300 text-sm">
                  <strong>В том числе по счетчику:</strong>{" "}
                  {byMeter.toLocaleString()} м³
                </p>
              </div>

              {existingRecord && (
                <div className="bg-yellow-500/10 rounded-xl p-3 border border-yellow-500/30">
                  <p className="text-yellow-300 text-sm">
                    ⚡ Мавжуд маълумотлар янгиланади
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading
                    ? "Сақланапти..."
                    : existingRecord
                      ? "Янгилаш"
                      : "Сақлаш"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  Бекор қилиш
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddGasData;
