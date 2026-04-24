// src/hooks/useGasData.js
import { useState, useEffect } from "react";
import { db, collection, getDocs } from "../firebase";

export const useGasData = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [gasData, setGasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка абонентов
  useEffect(() => {
    loadSubscribers();
  }, []);

  // Загрузка данных газовых счетчиков
  useEffect(() => {
    loadGasData();
  }, []);

  const loadSubscribers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "subscribers"));
      const subscribersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubscribers(subscribersData.filter((s) => s.status === "active"));
    } catch (error) {
      console.error("Ошибка загрузки абонентов:", error);
      setError(error.message);
    }
  };

  const loadGasData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "gasData"));
      const gasDataList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGasData(gasDataList);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([loadSubscribers(), loadGasData()]);
    setLoading(false);
  };

  return {
    subscribers,
    gasData,
    loading,
    error,
    refreshData,
  };
};
