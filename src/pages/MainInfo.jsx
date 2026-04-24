// src/pages/MainInfo.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  Edit2,
  Save,
  X,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";

const MainInfo = () => {
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "Ҳудудгаз Фарғона газ таъминоти филиали",
    directorName: "Ш.А.Абдумажидов",
    directorFullName: "Абдумажидов Шавкат Абдусаттарович",
    phone: "+998 (71) 123-45-67",
    email: "info@fergana.uzgas.uz",
    address: "Фарғона шаҳри, Навоий кўчаси, 15-уй",
    inn: "201234567",
    bankName: "Алокабанк",
    accountNumber: "20208000001234567890",
    mfo: "1440",
    workingHours: "Душанба-Жума 09:00-18:00",
    website: "www.fergana-gaz.uz",
    description:
      "Фарғона вилоятидаги юридик ва жисмоний шахсларни табиий газ билан таъминлаш",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Загрузка данных из Firestore
  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "settings", "companyInfo");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCompanyInfo(docSnap.data());
      } else {
        // Если данных нет, создаем с начальными значениями
        await setDoc(docRef, companyInfo);
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setLoading(false);
    }
  };

  // Сохранение данных
  const saveCompanyInfo = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "settings", "companyInfo");
      await setDoc(docRef, companyInfo);
      alert("Маълумотлар муваффақиятли сақланди!");
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Хатолик: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Отмена редактирования
  const cancelEditing = () => {
    loadCompanyInfo(); // Перезагружаем последние сохраненные данные
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="text-gray-400 mt-4">Юкланапти...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Асосий маълумотлар</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg transition-all"
          >
            <Edit2 className="w-4 h-4" />
            Таҳрирлаш
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={saveCompanyInfo}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Сақланапти..." : "Сақлаш"}
            </button>
            <button
              onClick={cancelEditing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all"
            >
              <X className="w-4 h-4" />
              Бекор қилиш
            </button>
          </div>
        )}
      </div>

      {/* Основная информация */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Левая колонка */}
        <div className="space-y-6">
          {/* Карточка компании */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
                <Building className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Филиал маълумотлари
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-cyan-400 text-sm mb-1">
                  Филиал номи
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyInfo.companyName}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        companyName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-white font-medium">
                    {companyInfo.companyName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-cyan-400 text-sm mb-1">
                  Директор
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyInfo.directorName}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        directorName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-white font-medium">
                    {companyInfo.directorName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-cyan-400 text-sm mb-1">
                  Директорнинг Ф.И.Ш.
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyInfo.directorFullName}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        directorFullName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-white">{companyInfo.directorFullName}</p>
                )}
              </div>

              <div>
                <label className="block text-cyan-400 text-sm mb-1">
                  Телефон
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyInfo.phone}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-white">{companyInfo.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-cyan-400 text-sm mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={companyInfo.email}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, email: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-white">{companyInfo.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Контактная информация */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
                <MapPin className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Манзил ва контактлар
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-cyan-400 text-sm mb-1">
                  Юридик манзил
                </label>
                {isEditing ? (
                  <textarea
                    value={companyInfo.address}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        address: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-white">{companyInfo.address}</p>
                )}
              </div>

              <div>
                <label className="block text-cyan-400 text-sm mb-1">
                  Иш вақти
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyInfo.workingHours}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        workingHours: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-white">{companyInfo.workingHours}</p>
                )}
              </div>

              <div>
                <label className="block text-cyan-400 text-sm mb-1">
                  Веб-сайт
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyInfo.website}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        website: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-white">{companyInfo.website}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Правая колонка */}
        <div className="space-y-6">
          {/* Банковские реквизиты */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
                <User className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Банк реквизитлари
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-cyan-400 text-sm mb-1">СТИР</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyInfo.inn}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, inn: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-white">{companyInfo.inn}</p>
                )}
              </div>

              <div>
                <label className="block text-cyan-400 text-sm mb-1">
                  Банк номи
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyInfo.bankName}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        bankName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-white">{companyInfo.bankName}</p>
                )}
              </div>

              <div>
                <label className="block text-cyan-400 text-sm mb-1">
                  Ҳисоб рақам (Ҳ/р)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyInfo.accountNumber}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        accountNumber: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-white">{companyInfo.accountNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-cyan-400 text-sm mb-1">МФО</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyInfo.mfo}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, mfo: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-white">{companyInfo.mfo}</p>
                )}
              </div>
            </div>
          </div>

          {/* Описание */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
                <Clock className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Қўшимча маълумот
              </h3>
            </div>

            <div>
              <label className="block text-cyan-400 text-sm mb-1">Тавсиф</label>
              {isEditing ? (
                <textarea
                  value={companyInfo.description}
                  onChange={(e) =>
                    setCompanyInfo({
                      ...companyInfo,
                      description: e.target.value,
                    })
                  }
                  rows="4"
                  className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                />
              ) : (
                <p className="text-white leading-relaxed">
                  {companyInfo.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainInfo;
