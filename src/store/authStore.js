// src/store/authStore.js
import { create } from "zustand";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const useAuthStore = create((set, get) => ({
  user: null,
  role: null,
  loading: false,
  error: null,
  lastActivity: Date.now(),

  updateLastActivity: () => {
    set({ lastActivity: Date.now() });
    // Сохраняем в localStorage для восстановления после обновления страницы
    localStorage.setItem("lastActivity", Date.now().toString());
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      let role = "user";
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          role = userDoc.data().role;
        } else {
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            role: "user",
            createdAt: new Date(),
          });
        }
      } catch (error) {
        console.log("Ошибка получения роли:", error);
      }

      // Сохраняем время последней активности
      const lastActivity = Date.now();
      localStorage.setItem("lastActivity", lastActivity.toString());

      set({ user, role, loading: false, lastActivity });
      return true;
    } catch (error) {
      let errorMessage = "Хатолик юз берди";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Фойдаланувчи топилмади";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Нотўғри парол";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Нотўғри email";
      }
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("lastActivity");
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
    set({ user: null, role: null, lastActivity: Date.now() });
  },

  checkIdleOnLoad: () => {
    const lastActivity = localStorage.getItem("lastActivity");
    if (lastActivity) {
      const inactiveTime = Date.now() - parseInt(lastActivity);
      const timeoutMinutes = 3 * 60 * 1000; // 3 минуты

      if (inactiveTime >= timeoutMinutes) {
        get().logout();
        return true;
      }
    }
    return false;
  },
}));

export default useAuthStore;
