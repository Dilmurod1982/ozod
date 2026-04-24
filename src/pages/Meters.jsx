// src/pages/Meters.jsx
import React, { useState, useEffect } from "react";
import {
  db,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "../firebase";
import {
  Cpu,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Meters = () => {
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    modelName: "",
    manufacturer: "",
    type: "electronic",
    accuracy: "",
    maxFlowRate: "",
    minFlowRate: "",
    connectionType: "",
    description: "",
  });
  const [subscribersWithMeters, setSubscribersWithMeters] = useState([]);

  // Типы счетчиков
  const meterTypes = [
    { value: "electronic", label: "Электрон" },
    { value: "mechanical", label: "Механик" },
    { value: "ultrasonic", label: "Ультратовуш" },
    { value: "turbine", label: "Турбина" },
  ];

  // Типы подключения
  const connectionTypes = [
    { value: "flange", label: "Фланец" },
    { value: "thread", label: "Резьба" },
    { value: "welding", label: "Пайванд" },
  ];

  // Загрузка счетчиков
  useEffect(() => {
    loadMeters();
    loadSubscribersWithMeters();
  }, []);

  const loadMeters = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "meters"));
      const metersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMeters(metersData);
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Хатолик: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSubscribersWithMeters = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "subscribers"));
      const subscribersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const withMeters = subscribersData.filter((s) => s.meterId);
      setSubscribersWithMeters(withMeters);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  const addMeter = async () => {
    if (!formData.modelName) {
      alert("Модель номи мажбурий!");
      return;
    }

    try {
      await addDoc(collection(db, "meters"), {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      alert("Ҳисоблагич қўшилди!");
      setIsAdding(false);
      setFormData({
        modelName: "",
        manufacturer: "",
        type: "electronic",
        accuracy: "",
        maxFlowRate: "",
        minFlowRate: "",
        connectionType: "",
        description: "",
      });
      loadMeters();
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Хатолик: " + error.message);
    }
  };

  const updateMeter = async () => {
    try {
      const meterRef = doc(db, "meters", editingId);
      await updateDoc(meterRef, {
        ...formData,
        updatedAt: new Date(),
      });
      alert("Маълумотлар янгиланди!");
      setEditingId(null);
      setFormData({
        modelName: "",
        manufacturer: "",
        type: "electronic",
        accuracy: "",
        maxFlowRate: "",
        minFlowRate: "",
        connectionType: "",
        description: "",
      });
      loadMeters();
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Хатолик: " + error.message);
    }
  };

  const deleteMeter = async (id, modelName) => {
    // Проверка, используется ли счетчик
    const isUsed = subscribersWithMeters.some((s) => s.meterId === id);
    if (isUsed) {
      alert(
        `Бу ҳисоблагич (${modelName}) айрим абонентларга бириктирилган. Аввал абонентлардан ажратинг!`,
      );
      return;
    }

    if (window.confirm(`${modelName} ни ўчиришни хоҳлайсизми?`)) {
      try {
        await deleteDoc(doc(db, "meters", id));
        alert("Ҳисоблагич ўчирилди!");
        loadMeters();
      } catch (error) {
        console.error("Ошибка:", error);
        alert("Хатолик: " + error.message);
      }
    }
  };

  const startEditing = (meter) => {
    setEditingId(meter.id);
    setFormData({
      modelName: meter.modelName || "",
      manufacturer: meter.manufacturer || "",
      type: meter.type || "electronic",
      accuracy: meter.accuracy || "",
      maxFlowRate: meter.maxFlowRate || "",
      minFlowRate: meter.minFlowRate || "",
      connectionType: meter.connectionType || "",
      description: meter.description || "",
    });
  };

  const filteredMeters = meters.filter(
    (meter) =>
      meter.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meter.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = {
    total: meters.length,
    electronic: meters.filter((m) => m.type === "electronic").length,
    mechanical: meters.filter((m) => m.type === "mechanical").length,
    ultrasonic: meters.filter((m) => m.type === "ultrasonic").length,
    turbine: meters.filter((m) => m.type === "turbine").length,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Ҳисоблагичлар моделлари
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Янги ҳисоблагич
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
          <Cpu className="w-6 h-6 text-cyan-400 mb-2" />
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-cyan-300 text-sm">Жами моделлар</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
          <Activity className="w-6 h-6 text-green-400 mb-2" />
          <div className="text-2xl font-bold text-white">
            {stats.electronic}
          </div>
          <div className="text-green-300 text-sm">Электрон</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
          <Activity className="w-6 h-6 text-yellow-400 mb-2" />
          <div className="text-2xl font-bold text-white">
            {stats.mechanical}
          </div>
          <div className="text-yellow-300 text-sm">Механик</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
          <Activity className="w-6 h-6 text-purple-400 mb-2" />
          <div className="text-2xl font-bold text-white">
            {stats.ultrasonic}
          </div>
          <div className="text-purple-300 text-sm">Ультратовуш</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30">
          <Activity className="w-6 h-6 text-red-400 mb-2" />
          <div className="text-2xl font-bold text-white">{stats.turbine}</div>
          <div className="text-red-300 text-sm">Турбина</div>
        </div>
      </div>

      {/* Поиск */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Қидириш (модель номи, ишлаб чиқарувчи)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Форма добавления */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
          <div className="w-full max-w-2xl mx-4 backdrop-blur-xl bg-black/80 rounded-2xl border border-white/10 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                Янги ҳисоблагич қўшиш
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto px-2">
              <div>
                <label className="block text-cyan-400 text-sm mb-1">
                  Модель номи *
                </label>
                <input
                  type="text"
                  placeholder="Масалан: СГБ-4"
                  value={formData.modelName}
                  onChange={(e) =>
                    setFormData({ ...formData, modelName: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-cyan-400 text-sm mb-1">
                  Ишлаб чиқарувчи
                </label>
                <input
                  type="text"
                  placeholder="Масалан: Элстер, Самсунг"
                  value={formData.manufacturer}
                  onChange={(e) =>
                    setFormData({ ...formData, manufacturer: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-cyan-400 text-sm mb-1">Типи</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                >
                  {meterTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    Аниқлик синфи
                  </label>
                  <input
                    type="text"
                    placeholder="Масалан: 1.0, 2.5"
                    value={formData.accuracy}
                    onChange={(e) =>
                      setFormData({ ...formData, accuracy: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    Улаш тури
                  </label>
                  <select
                    value={formData.connectionType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        connectionType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  >
                    <option value="">Танланг</option>
                    {connectionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    Макс. оқим (м³/соат)
                  </label>
                  <input
                    type="number"
                    placeholder="Максимал оқим"
                    value={formData.maxFlowRate}
                    onChange={(e) =>
                      setFormData({ ...formData, maxFlowRate: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    Мин. оқим (м³/соат)
                  </label>
                  <input
                    type="number"
                    placeholder="Минимал оқим"
                    value={formData.minFlowRate}
                    onChange={(e) =>
                      setFormData({ ...formData, minFlowRate: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-cyan-400 text-sm mb-1">
                  Тавсиф
                </label>
                <textarea
                  rows="3"
                  placeholder="Қўшимча маълумот"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={addMeter}
                  className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:shadow-lg transition-all"
                >
                  <Save className="inline w-4 h-4 mr-2" />
                  Сақлаш
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  Бекор қилиш
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Таблица счетчиков */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          <p className="text-gray-400 mt-2">Юкланапти...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="text-left py-3 px-3">№</th>
                <th className="text-left py-3 px-3">Модель номи</th>
                <th className="text-left py-3 px-3">Ишлаб чиқарувчи</th>
                <th className="text-left py-3 px-3">Типи</th>
                <th className="text-left py-3 px-3">Аниқлик</th>
                <th className="text-left py-3 px-3">Оқим (м³/с)</th>
                <th className="text-center py-3 px-3">Ҳаракатлар</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeters.map((meter, index) => (
                <tr
                  key={meter.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  {editingId === meter.id ? (
                    // Режим редактирования
                    <>
                      <td className="py-2 px-3">{index + 1}</td>
                      <td className="py-2 px-3">
                        <input
                          value={formData.modelName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              modelName: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 rounded bg-white/10 text-white"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          value={formData.manufacturer}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              manufacturer: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 rounded bg-white/10 text-white"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <select
                          value={formData.type}
                          onChange={(e) =>
                            setFormData({ ...formData, type: e.target.value })
                          }
                          className="w-full px-2 py-1 rounded bg-white/10 text-white"
                        >
                          {meterTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          value={formData.accuracy}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              accuracy: e.target.value,
                            })
                          }
                          className="w-20 px-2 py-1 rounded bg-white/10 text-white"
                        />
                      </td>
                      <td className="py-2 px-3">
                        {formData.minFlowRate} - {formData.maxFlowRate}
                      </td>
                      <td className="py-2 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={updateMeter}
                          className="text-green-400 hover:text-green-300 mx-1"
                          title="Сақлаш"
                        >
                          <Save className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-red-400 hover:text-red-300 mx-1"
                          title="Бекор қилиш"
                        >
                          <X className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </>
                  ) : (
                    // Обычный режим
                    <>
                      <td className="py-2 px-3">{index + 1}</td>
                      <td className="py-2 px-3 font-medium">
                        {meter.modelName}
                      </td>
                      <td className="py-2 px-3">{meter.manufacturer || "-"}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            meter.type === "electronic"
                              ? "bg-green-500/20 text-green-300"
                              : meter.type === "mechanical"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : meter.type === "ultrasonic"
                                  ? "bg-purple-500/20 text-purple-300"
                                  : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {meterTypes.find((t) => t.value === meter.type)
                            ?.label || meter.type}
                        </span>
                      </td>
                      <td className="py-2 px-3">{meter.accuracy || "-"}</td>
                      <td className="py-2 px-3">
                        {meter.minFlowRate && meter.maxFlowRate
                          ? `${meter.minFlowRate} - ${meter.maxFlowRate}`
                          : "-"}
                      </td>
                      <td className="py-2 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => startEditing(meter)}
                          className="text-cyan-400 hover:text-cyan-300 mx-1"
                          title="Таҳрирлаш"
                        >
                          <Edit2 className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => deleteMeter(meter.id, meter.modelName)}
                          className="text-red-400 hover:text-red-300 mx-1"
                          title="Ўчириш"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMeters.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Cpu className="w-12 h-12 mx-auto mb-3 opacity-50" />
              Ҳеч қандай ҳисоблагич топилмади
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Meters;
