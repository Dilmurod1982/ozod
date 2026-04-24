import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { UserPlus, Trash2, Edit2 } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    setUsers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const addUser = async () => {
    if (!email) return;
    await addDoc(collection(db, "users"), {
      email,
      role,
      createdAt: new Date(),
    });
    setEmail("");
    loadUsers();
  };

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    loadUsers();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        Фойдаланувчиларни бошқариш
      </h2>

      <div className="flex gap-4 mb-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Фойдаланувчи эл. почтаси"
          className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
        >
          <option value="user">Фойдаланувчи</option>
          <option value="admin">Админ</option>
        </select>
        <button
          onClick={addUser}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
        >
          <UserPlus className="w-4 h-4" /> Қўшиш
        </button>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div>
              <p className="text-white">{user.email}</p>
              <span className="text-xs text-cyan-400">
                {user.role === "admin" ? "Админ" : "Фойдаланувчи"}
              </span>
            </div>
            <button
              onClick={() => deleteUser(user.id)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
