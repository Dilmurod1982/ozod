import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Printer } from "lucide-react";

const PrintAct = () => {
  const [acts, setActs] = useState([]);
  const [selectedAct, setSelectedAct] = useState(null);

  useEffect(() => {
    loadActs();
  }, []);

  const loadActs = async () => {
    const querySnapshot = await getDocs(collection(db, "acts"));
    setActs(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const printAct = (act) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Акт сверка - ${act.companyName}</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; margin: 0; background: white; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 18px; font-weight: bold; margin: 10px 0; }
            .company-info { margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #000; padding: 8px; text-align: center; }
            th { background: #f0f0f0; }
            .signature { margin-top: 40px; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">"ҲУДУДГАЗ ФАРҒОНА" МЧЖ</div>
            <div class="title">АКТ № ____</div>
            <div>ўзаро ҳисоб-китобларни солиштириш тўғрисида</div>
          </div>
          
          <div class="company-info">
            <p><strong>Қарздор:</strong> ${act.companyName}</p>
            <p><strong>ИНН:</strong> ${act.inn}</p>
            <p><strong>Манзил:</strong> ${act.address}</p>
            <p><strong>Давр:</strong> ${act.periodStart} дан ${act.periodEnd} гача</p>
          </div>

          <table>
            <thead>
              <tr><th>Кўрсаткич</th><th>Давр бошида</th><th>Давр охирида</th></tr>
            </thead>
            <tbody>
              <tr><td>Дебет (Облгаз томонидан)</td><td>${Number(act.debitStart).toLocaleString()} сўм</td><td>${Number(act.debitEnd).toLocaleString()} сўм</td></tr>
              <tr><td>Кредит (Абонент томонидан)</td><td>${Number(act.creditStart).toLocaleString()} сўм</td><td>${Number(act.creditEnd).toLocaleString()} сўм</td></tr>
              <tr style="font-weight:bold"><td>Қарз суммаси</td><td>${(Number(act.debitStart) - Number(act.creditStart)).toLocaleString()} сўм</td><td>${(Number(act.debitEnd) - Number(act.creditEnd)).toLocaleString()} сўм</td></tr>
            </tbody>
          </table>

          <div class="signature">
            <div>__________________<br>Облгаз вакили</div>
            <div>__________________<br>Абонент вакили</div>
          </div>
          <p style="margin-top:30px; font-size:12px; text-align:center">Акт электрон тизимда тасдиқланган ва қўлда имзоланмайди</p>
        </body>
      </html>
    `);
    printWindow.print();
    printWindow.close();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        Акт сверкаларини чоп этиш
      </h2>
      <div className="space-y-3">
        {acts.map((act) => (
          <div
            key={act.id}
            className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div>
              <p className="text-white font-semibold">{act.companyName}</p>
              <p className="text-gray-400 text-sm">
                {act.periodStart} - {act.periodEnd}
              </p>
            </div>
            <button
              onClick={() => printAct(act)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
            >
              <Printer className="w-4 h-4" /> Актни чоп этиш
            </button>
          </div>
        ))}
        {acts.length === 0 && (
          <p className="text-gray-400 text-center py-10">
            Ҳеч қандай маълумот топилмади
          </p>
        )}
      </div>
    </div>
  );
};

export default PrintAct;
