// src/pages/Subscribers.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
  Users,
  CreditCard,
  Banknote,
  FileText,
  Cpu,
} from "lucide-react";

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    agtkshNumber: "",
    directorName: "",
    stir: "",
    bankName: "",
    accountNumber: "",
    mfo: "",
    phone: "",
    address: "",
    meterId: "",
    meterSerialNumber: "",
    status: "active",
  });

  // Загрузка абонентов и счетчиков
  useEffect(() => {
    loadSubscribers();
    loadMeters();
  }, []);

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "subscribers"));
      const subscribersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubscribers(subscribersData);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      alert("Хатолик: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMeters = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "meters"));
      const metersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMeters(metersData);
    } catch (error) {
      console.error("Ошибка загрузки счетчиков:", error);
    }
  };

  // Добавление абонента
  const addSubscriber = async () => {
    if (!formData.companyName || !formData.stir) {
      alert("Абонент номи ва СТИР мажбурий!");
      return;
    }

    try {
      await addDoc(collection(db, "subscribers"), {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      alert("Абонент қўшилди!");
      setIsAdding(false);
      setFormData({
        companyName: "",
        agtkshNumber: "",
        directorName: "",
        stir: "",
        bankName: "",
        accountNumber: "",
        mfo: "",
        phone: "",
        address: "",
        meterId: "",
        meterSerialNumber: "",
        status: "active",
      });
      loadSubscribers();
    } catch (error) {
      console.error("Ошибка добавления:", error);
      alert("Хатолик: " + error.message);
    }
  };

  // Обновление абонента
  const updateSubscriber = async () => {
    try {
      const subscriberRef = doc(db, "subscribers", editingId);
      await updateDoc(subscriberRef, {
        ...formData,
        updatedAt: new Date(),
      });
      alert("Маълумотлар янгиланди!");
      setEditingId(null);
      setFormData({
        companyName: "",
        agtkshNumber: "",
        directorName: "",
        stir: "",
        bankName: "",
        accountNumber: "",
        mfo: "",
        phone: "",
        address: "",
        meterId: "",
        meterSerialNumber: "",
        status: "active",
      });
      loadSubscribers();
    } catch (error) {
      console.error("Ошибка обновления:", error);
      alert("Хатолик: " + error.message);
    }
  };

  // Удаление абонента
  const deleteSubscriber = async (id, name) => {
    if (window.confirm(`${name} ни ўчиришни хоҳлайсизми?`)) {
      try {
        await deleteDoc(doc(db, "subscribers", id));
        alert("Абонент ўчирилди!");
        loadSubscribers();
      } catch (error) {
        console.error("Ошибка удаления:", error);
        alert("Хатолик: " + error.message);
      }
    }
  };

  // Редактирование абонента
  const startEditing = (subscriber) => {
    setEditingId(subscriber.id);
    setFormData({
      companyName: subscriber.companyName || "",
      agtkshNumber: subscriber.agtkshNumber || "",
      directorName: subscriber.directorName || "",
      stir: subscriber.stir || "",
      bankName: subscriber.bankName || "",
      accountNumber: subscriber.accountNumber || "",
      mfo: subscriber.mfo || "",
      phone: subscriber.phone || "",
      address: subscriber.address || "",
      meterId: subscriber.meterId || "",
      meterSerialNumber: subscriber.meterSerialNumber || "",
      status: subscriber.status || "active",
    });
  };

  // Получение информации о счетчике по ID
  const getMeterInfo = (meterId) => {
    const meter = meters.find((m) => m.id === meterId);
    return meter;
  };

  // Фильтрация абонентов по поиску
  const filteredSubscribers = subscribers.filter(
    (sub) =>
      sub.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.stir?.includes(searchTerm) ||
      sub.agtkshNumber?.includes(searchTerm) ||
      sub.directorName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Статистика
  const stats = {
    total: subscribers.length,
    active: subscribers.filter((s) => s.status === "active").length,
    inactive: subscribers.filter((s) => s.status === "inactive").length,
    withMeter: subscribers.filter((s) => s.meterId).length,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Абонентлар</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Янги абонент
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
          <Users className="w-6 h-6 text-cyan-400 mb-2" />
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-cyan-300 text-sm">Жами абонентлар</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
          <Building2 className="w-6 h-6 text-green-400 mb-2" />
          <div className="text-2xl font-bold text-white">{stats.active}</div>
          <div className="text-green-300 text-sm">Фаол абонентлар</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30">
          <FileText className="w-6 h-6 text-red-400 mb-2" />
          <div className="text-2xl font-bold text-white">{stats.inactive}</div>
          <div className="text-red-300 text-sm">Нofaол абонентлар</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
          <Cpu className="w-6 h-6 text-purple-400 mb-2" />
          <div className="text-2xl font-bold text-white">{stats.withMeter}</div>
          <div className="text-purple-300 text-sm">Ҳисоблагичли</div>
        </div>
      </div>

      {/* Поиск */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Қидириш (номи, СТИР, АГТКШ рақами, директор Ф.И.Ш.)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Форма добавления */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
          <div className="w-full max-w-4xl mx-4 backdrop-blur-xl bg-black/80 rounded-2xl border border-white/10 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                Янги абонент қўшиш
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-cyan-400 text-sm mb-1">
                    Абонент номи *
                  </label>
                  <input
                    type="text"
                    placeholder="Корхонанинг тўлиқ номи"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    АГТКШ рақами
                  </label>
                  <input
                    type="text"
                    placeholder="АГТКШ рақами"
                    value={formData.agtkshNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, agtkshNumber: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    СТИР *
                  </label>
                  <input
                    type="text"
                    placeholder="СТИР рақами"
                    value={formData.stir}
                    onChange={(e) =>
                      setFormData({ ...formData, stir: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-cyan-400 text-sm mb-1">
                    Директор Ф.И.Ш.
                  </label>
                  <input
                    type="text"
                    placeholder="Директорнинг ф.и.ш."
                    value={formData.directorName}
                    onChange={(e) =>
                      setFormData({ ...formData, directorName: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    Банк номи
                  </label>
                  <input
                    type="text"
                    placeholder="Банк номи"
                    value={formData.bankName}
                    onChange={(e) =>
                      setFormData({ ...formData, bankName: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    Ҳ/р (ҳисоб рақам)
                  </label>
                  <input
                    type="text"
                    placeholder="Ҳисоб рақами"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accountNumber: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    МФО
                  </label>
                  <input
                    type="text"
                    placeholder="МФО коди"
                    value={formData.mfo}
                    onChange={(e) =>
                      setFormData({ ...formData, mfo: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    Телефон
                  </label>
                  <input
                    type="text"
                    placeholder="Телефон рақами"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-cyan-400 text-sm mb-1">
                    Манзил
                  </label>
                  <input
                    type="text"
                    placeholder="Юридик манзил"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Выбор счетчика */}
                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    Ҳисоблагич модели
                  </label>
                  <select
                    value={formData.meterId}
                    onChange={(e) =>
                      setFormData({ ...formData, meterId: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Ҳисоблагич танланг</option>
                    {meters.map((meter) => (
                      <option key={meter.id} value={meter.id}>
                        {meter.modelName} (
                        {meter.type === "electronic"
                          ? "Электрон"
                          : meter.type === "mechanical"
                            ? "Механик"
                            : meter.type === "ultrasonic"
                              ? "Ультратовуш"
                              : "Турбина"}
                        )
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    Ҳисоблагич серия рақами
                  </label>
                  <input
                    type="text"
                    placeholder="Ҳисоблагич серия рақами"
                    value={formData.meterSerialNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meterSerialNumber: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-cyan-400 text-sm mb-1">
                    Ҳолати
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="active">Фаол</option>
                    <option value="inactive">Нofaол</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={addSubscriber}
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

      {/* Таблица абонентов */}
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
                <th className="text-left py-3 px-3 text-sm">№</th>
                <th className="text-left py-3 px-3 text-sm">Абонент номи</th>
                <th className="text-left py-3 px-3 text-sm">АГТКШ рақами</th>
                <th className="text-left py-3 px-3 text-sm">Директор Ф.И.Ш.</th>
                <th className="text-left py-3 px-3 text-sm">СТИР</th>
                <th className="text-left py-3 px-3 text-sm">Ҳисоблагич</th>
                <th className="text-left py-3 px-3 text-sm">Ҳолат</th>
                <th className="text-center py-3 px-3 text-sm">Ҳаракатлар</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((subscriber, index) => {
                const meterInfo = getMeterInfo(subscriber.meterId);
                return (
                  <tr
                    key={subscriber.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    {editingId === subscriber.id ? (
                      // Режим редактирования
                      <>
                        <td className="py-2 px-3">{index + 1}</td>
                        <td className="py-2 px-3">
                          <input
                            value={formData.companyName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                companyName: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 rounded bg-white/10 text-white text-sm"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            value={formData.agtkshNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                agtkshNumber: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 rounded bg-white/10 text-white text-sm"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            value={formData.directorName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                directorName: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 rounded bg-white/10 text-white text-sm"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            value={formData.stir}
                            onChange={(e) =>
                              setFormData({ ...formData, stir: e.target.value })
                            }
                            className="w-full px-2 py-1 rounded bg-white/10 text-white text-sm"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <div className="space-y-1">
                            <select
                              value={formData.meterId}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  meterId: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 rounded bg-white/10 text-white text-sm"
                            >
                              <option value="">Танланг</option>
                              {meters.map((meter) => (
                                <option key={meter.id} value={meter.id}>
                                  {meter.modelName}
                                </option>
                              ))}
                            </select>
                            <input
                              placeholder="Серия рақами"
                              value={formData.meterSerialNumber}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  meterSerialNumber: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 rounded bg-white/10 text-white text-sm"
                            />
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={formData.status}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                status: e.target.value,
                              })
                            }
                            className="px-2 py-1 rounded bg-white/10 text-white text-sm"
                          >
                            <option value="active">Фаол</option>
                            <option value="inactive">Нofaол</option>
                          </select>
                        </td>
                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          <button
                            onClick={updateSubscriber}
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
                        <td className="py-2 px-3 text-sm">{index + 1}</td>
                        <td className="py-2 px-3 font-medium text-sm">
                          {subscriber.companyName || "-"}
                        </td>
                        <td className="py-2 px-3 text-sm">
                          {subscriber.agtkshNumber || "-"}
                        </td>
                        <td className="py-2 px-3 text-sm">
                          {subscriber.directorName || "-"}
                        </td>
                        <td className="py-2 px-3 text-sm">
                          {subscriber.stir || "-"}
                        </td>
                        <td className="py-2 px-3 text-sm">
                          {meterInfo ? (
                            <div>
                              <span className="text-cyan-300">
                                {meterInfo.modelName}
                              </span>
                              {subscriber.meterSerialNumber && (
                                <div className="text-xs text-gray-400">
                                  № {subscriber.meterSerialNumber}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              subscriber.status === "active"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {subscriber.status === "active" ? "Фаол" : "Нofaол"}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => startEditing(subscriber)}
                            className="text-cyan-400 hover:text-cyan-300 mx-1"
                            title="Таҳрирлаш"
                          >
                            <Edit2 className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() =>
                              deleteSubscriber(
                                subscriber.id,
                                subscriber.companyName,
                              )
                            }
                            className="text-red-400 hover:text-red-300 mx-1"
                            title="Ўчириш"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredSubscribers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              Ҳеч қандай абонент топилмади
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Subscribers;
