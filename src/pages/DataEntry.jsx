import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { Save } from "lucide-react";

const DataEntry = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    inn: "",
    address: "",
    periodStart: "",
    periodEnd: "",
    debitStart: "",
    creditStart: "",
    debitEnd: "",
    creditEnd: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "acts"), {
      ...formData,
      createdAt: new Date(),
    });
    alert("Маълумотлар сақланди!");
    setFormData({
      companyName: "",
      inn: "",
      address: "",
      periodStart: "",
      periodEnd: "",
      debitStart: "",
      creditStart: "",
      debitEnd: "",
      creditEnd: "",
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        Акт учун маълумотлар киритиш
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Корхона номи"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            required
          />
          <input
            type="text"
            placeholder="ИНН"
            value={formData.inn}
            onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            required
          />
          <input
            type="text"
            placeholder="Манзил"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="col-span-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            required
          />
          <input
            type="date"
            value={formData.periodStart}
            onChange={(e) =>
              setFormData({ ...formData, periodStart: e.target.value })
            }
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            required
          />
          <input
            type="date"
            value={formData.periodEnd}
            onChange={(e) =>
              setFormData({ ...formData, periodEnd: e.target.value })
            }
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            required
          />
          <input
            type="number"
            placeholder="Давр бошида дебет"
            value={formData.debitStart}
            onChange={(e) =>
              setFormData({ ...formData, debitStart: e.target.value })
            }
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            required
          />
          <input
            type="number"
            placeholder="Давр бошида кредит"
            value={formData.creditStart}
            onChange={(e) =>
              setFormData({ ...formData, creditStart: e.target.value })
            }
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            required
          />
          <input
            type="number"
            placeholder="Давр охирида дебет"
            value={formData.debitEnd}
            onChange={(e) =>
              setFormData({ ...formData, debitEnd: e.target.value })
            }
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            required
          />
          <input
            type="number"
            placeholder="Давр охирида кредит"
            value={formData.creditEnd}
            onChange={(e) =>
              setFormData({ ...formData, creditEnd: e.target.value })
            }
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
        >
          <Save className="w-4 h-4" /> Маълумотларни сақлаш
        </button>
      </form>
    </div>
  );
};

export default DataEntry;
