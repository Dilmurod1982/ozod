// src/pages/PrintAct.jsx - финальная версия (печать каждого абонента отдельно)
import React, { useState, useEffect } from "react";
import { db, collection, getDocs } from "../firebase";
import { Printer, CheckSquare, Square, Calendar } from "lucide-react";

const PrintAct = () => {
  const [gasData, setGasData] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [meters, setMeters] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [showData, setShowData] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [currentPrintIndex, setCurrentPrintIndex] = useState(0);
  const [itemsToPrint, setItemsToPrint] = useState([]);

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const gasDataSnapshot = await getDocs(collection(db, "gasData"));
      const gasDataList = gasDataSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGasData(gasDataList);

      const subscribersSnapshot = await getDocs(collection(db, "subscribers"));
      const subscribersList = subscribersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubscribers(subscribersList);

      const metersSnapshot = await getDocs(collection(db, "meters"));
      const metersList = metersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMeters(metersList);

      const settingsSnapshot = await getDocs(collection(db, "settings"));
      const companyData = settingsSnapshot.docs.find(
        (doc) => doc.id === "companyInfo",
      );
      if (companyData) {
        setCompanyInfo(companyData.data());
      } else {
        setCompanyInfo({
          companyName: "Ҳудудгаз Фарғона газ таъминоти филиали",
          directorName: "Ш.Абдумажидов",
        });
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Хатолик: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMeterModel = (meterId) => {
    if (!meterId) return "AutoPilot Pro";
    const meter = meters.find((m) => m.id === meterId);
    return meter ? meter.modelName : "AutoPilot Pro";
  };

  const getLastDayOfMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const formatDate = (year, month, day) => {
    return `${day.toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}.${year}`;
  };

  const numberToWords = (num) => {
    if (num === 0 || !num) return "ноль";

    const units = [
      "",
      "бир",
      "икки",
      "уч",
      "тўрт",
      "беш",
      "олти",
      "етти",
      "саккиз",
      "тўққиз",
    ];
    const tens = [
      "",
      "ўн",
      "йигирма",
      "ўттиз",
      "қирқ",
      "эллик",
      "олтмиш",
      "етмиш",
      "саксон",
      "тўқсон",
    ];

    const convertLessThanThousand = (n) => {
      if (n === 0) return "";
      if (n < 10) return units[n];
      if (n < 20) {
        const teens = [
          "",
          "бир",
          "икки",
          "уч",
          "тўрт",
          "беш",
          "олти",
          "етти",
          "саккиз",
          "тўққиз",
          "ўн",
          "ўн бир",
          "ўн икки",
          "ўн уч",
          "ўн тўрт",
          "ўн беш",
          "ўн олти",
          "ўн етти",
          "ўн саккиз",
          "ўн тўққиз",
        ];
        return teens[n];
      }
      if (n < 100) {
        const ten = Math.floor(n / 10);
        const unit = n % 10;
        return tens[ten] + (unit > 0 ? " " + units[unit] : "");
      }
      const hundred = Math.floor(n / 100);
      const remainder = n % 100;
      return (
        units[hundred] +
        " юз" +
        (remainder > 0 ? " " + convertLessThanThousand(remainder) : "")
      );
    };

    let result = "";
    let n = Math.floor(num);

    if (n >= 1000000) {
      const millions = Math.floor(n / 1000000);
      result += convertLessThanThousand(millions) + " миллион ";
      n %= 1000000;
    }

    if (n >= 1000) {
      const thousands = Math.floor(n / 1000);
      if (thousands === 1) {
        result += "бир минг ";
      } else {
        result += convertLessThanThousand(thousands) + " минг ";
      }
      n %= 1000;
    }

    if (n > 0) {
      result += convertLessThanThousand(n);
    }

    return result.trim();
  };

  const formatNumber = (num) => {
    return (num || 0).toLocaleString();
  };

  const filterData = async () => {
    setLoading(true);
    try {
      const filtered = gasData.filter(
        (item) => item.year === selectedYear && item.month === selectedMonth,
      );
      const processedData = [];

      for (const subscriber of subscribers) {
        const data = filtered.find(
          (item) => item.subscriberId === subscriber.id,
        );
        if (data) {
          const totalGas = data.totalGas || 0;
          const configError = data.configError || 0;
          const lowPressure = data.lowPressure || 0;
          const power = data.power || 0;
          const byMeter = totalGas - configError - lowPressure - power;
          const restoredVolume = configError + lowPressure + power;

          processedData.push({
            ...subscriber,
            ...data,
            byMeter,
            restoredVolume,
            meterModel: getMeterModel(subscriber.meterId),
            selected: false,
          });
        }
      }

      setTableData(processedData);
      setShowData(true);
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Хатолик: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  const selectAll = () => {
    setTableData((prev) => prev.map((item) => ({ ...item, selected: true })));
  };

  const deselectAll = () => {
    setTableData((prev) => prev.map((item) => ({ ...item, selected: false })));
  };

  // Генерация HTML для одного абонента (2 страницы)
  const generateSingleActHTML = (sub) => {
    const lastDay = getLastDayOfMonth(selectedYear, selectedMonth);
    const dateStr = formatDate(selectedYear, selectedMonth, lastDay);
    const monthName = months[selectedMonth - 1];
    const yearMonth = `${selectedYear} йил ${monthName}`;
    const companyName =
      companyInfo?.companyName || "Ҳудудгаз Фарғона газ таъминоти филиали";
    const directorName = companyInfo?.directorName || "Ш.Абдумажидов";

    const totalGas = sub.totalGas || 0;
    const byMeter = sub.byMeter || 0;
    const power = sub.power || 0;
    const configError = sub.configError || 0;
    const lowPressure = sub.lowPressure || 0;
    const restoredVolume = sub.restoredVolume || 0;
    const totalGasWords = numberToWords(totalGas);
    const meterModel = sub.meterModel || "AutoPilot Pro";

    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Акт - ${sub.companyName} - ${yearMonth}</title>
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body { 
          font-family: 'Times New Roman', Times, serif; 
          font-size: 14pt; 
          line-height: 1.3;
          background: white;
        }
        .page1 {
          page-break-after: always;
        }
        .text-center { text-align: center; }
        .text-justify { text-align: justify; }
        .flex-between { display: flex; justify-content: space-between; }
        .bold { font-weight: bold; }
        .mb-10 { margin-bottom: 10px; }
        .mb-20 { margin-bottom: 20px; }
        .mt-20 { margin-top: 20px; }
        .mt-50 { margin-top: 50px; }
        .w-45 { width: 45%; }
        .w-280 { width: 280px; }
        .w-400 { width: 400px; }
        .signature-line {
          margin-top: 50px;
          border-top: 1px solid black;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <!-- Страница 1 -->
      <div class="page1">
        <div class="text-center mb-20">
          <div class="bold" style="font-size: 16pt; margin: 8px 0; text-transform: uppercase;">ТАБИИЙ ГАЗ ЕТКАЗИБ БЕРИШ-ҚАБУЛ ҚИЛИШ</div>
          <div class="bold" style="font-size: 16pt; margin: 8px 0; text-transform: uppercase;">ДАЛОЛАТНОМАСИ</div>
          <div class="mb-10">${yearMonth} учун</div>
        </div>
        
        <div class="flex-between mb-20">
          <div>${dateStr} йил</div>
          <div>Фарғона шаҳар</div>
        </div>
        
        <div class="text-justify">
          <p>Биз ким қуйида имзо чекувчилар “Истеъмолчи” вакили <strong>“${sub.companyName}”</strong> директори <strong>${sub.directorName || "_______________"}</strong> ва “Таъминотчи” вакили <strong>“${companyName}”</strong> директори <strong>${directorName}</strong> ушбу далолатномани туздик, яъни шуни тасдиқлаймизки, ${yearMonth} ойда “Таъминотчи” томонидан етказиб берилган ва “Истеъмолчи” томонидан қабул қилинган табиий газ ҳажми <strong>“${meterModel}”</strong> русумли электрон ҳисоблагич қурилмасининг архив маълумотлари (чоп этилган маълумотлар) асосида қуйидагича ташкил этади:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tbody>
              <tr><td class="w-280" style="padding: 5px;">1. Сотиш учун:</td><td class="bold" style="padding: 5px;">${formatNumber(byMeter)}</td><td style="padding: 5px;">м³</td></tr>
              <tr><td class="w-280" style="padding: 5px;">2. Далолатнома бўйича:</td><td class="bold" style="padding: 5px;">${formatNumber(power)}</td><td style="padding: 5px;">м³</td></tr>
            </tbody>
          </table>
          
          <p>Жами ${yearMonth} ойида “Таъминотчи” томонидан етказиб берилган газ <strong>${formatNumber(totalGas)} м³</strong> ташкил этади</p>
          <p><strong>${totalGasWords}</strong> (${formatNumber(totalGas)}) м³</p>
          <p>Юқорида кўрсатилган газ ҳажми томонлар ўртасидаги ҳисоб-китоблар учун асос ҳисобланади ва тузилган шартномага мувофиқ амал қилади.</p>
        </div>
        
        <div class="flex-between mt-50">
          <div class="w-45">
            <div>“Истеъмолчи” вакили</div>
            <div><strong>“${sub.companyName}”</strong></div>
            <div>Директори</div>
            <div class="signature-line"></div>
            <div>${sub.directorName || "_______________"}</div>
          </div>
          <div class="w-45">
            <div>“Таъминотчи” вакили</div>
            <div><strong>“${companyName}”</strong></div>
            <div>директори</div>
            <div class="signature-line"></div>
            <div>${directorName}</div>
          </div>
        </div>
      </div>
      
      <!-- Страница 2 -->
      <div>
        <div class="text-center mb-20">
          <div class="bold" style="font-size: 16pt; margin: 8px 0; text-transform: uppercase;">ЭЛЕКТРОН ҲИСОБЛАГИЧ МАЪЛУМОТЛАРИНИ ТАҲЛИЛ ҚИЛИШ ВА ТУЗАТИШ ДАЛОЛАТНОМАСИ</div>
          <div class="mb-10">${yearMonth}</div>
          <div><strong>“${sub.companyName}” “${meterModel}”</strong></div>
        </div>
        
        <div class="flex-between mb-20">
          <div>${dateStr} йил</div>
          <div>Фарғона шаҳар</div>
        </div>
        
        <div class="text-justify">
          <p>${yearMonth} ойида “Истеъмолчи”га ўрнатилган <strong>“${meterModel}”</strong> русумли электрон ҳисоблагич қурилмасининг архив файллари таҳлили натижасида барча маълумотлар қурилма конфигурациясига киритилган ҳисоб-китоб маълумотларига мос келиши ва газ сарфини ҳисоблашга таъсир қилувчи ҳар қандай аралашувлар аниқланмади. ${yearMonth} ойида “Истеъмолчи” томонидан қабул қилинган жами газ ҳажми <strong>${formatNumber(byMeter)} м³</strong> ташкил этади.</p>
          
          <p>${yearMonth} ойида ҳисоблагич ишлаган вақтда босим фарқи рухсат этилган энг паст чегарадан паст бўлган ҳолатларда O‘zDSt 8.074:2077 стандартига мувофиқ қайта ҳисоб-китоб қилинди ва қуйидагилар аниқланди:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tbody>
              <tr><td class="w-400" style="padding: 5px;">1. 6.2.7-банд бўйича (Низкий перепад):</td><td class="bold" style="padding: 5px;">${formatNumber(lowPressure)}</td><td style="padding: 5px;">м³</td></tr>
              <tr><td class="w-400" style="padding: 5px;">2. 6.2.1.1-банд бўйича (Ошибка конфигурации):</td><td class="bold" style="padding: 5px;">${formatNumber(configError)}</td><td style="padding: 5px;">м³</td></tr>
              <tr><td class="w-400" style="padding: 5px;">3. Қувват бўйича:</td><td class="bold" style="padding: 5px;">${formatNumber(power)}</td><td style="padding: 5px;">м³</td></tr>
            </tbody>
          </table>
          
          <p>Жами тикланган газ ҳажми <strong>${formatNumber(restoredVolume)} м³</strong> ташкил этди.</p>
          <p>Шу асосда ${yearMonth} ойида умумий қабул қилинган газ ҳажми (тикланган ҳажмларни ҳисобга олган ҳолда) <strong>${formatNumber(totalGas)} м³</strong> ташкил этиб ишончли деб ҳисобланади.</p>
        </div>
        
        <div class="w-45 mt-50">
          <div>“${sub.companyName}” директори</div>
          <div class="signature-line"></div>
          <div>${sub.directorName || "_______________"}</div>
        </div>
      </div>
    </body>
    </html>`;
  };

  // Печать одного абонента
  const printOneSubscriber = (subscriber, index) => {
    const html = generateSingleActHTML(subscriber);
    const printWindow = window.open("", "_blank");
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
        // Печатаем следующего абонента
        if (index + 1 < itemsToPrint.length) {
          setTimeout(() => {
            printOneSubscriber(itemsToPrint[index + 1], index + 1);
          }, 500);
        } else {
          setPrinting(false);
          setCurrentPrintIndex(0);
          setItemsToPrint([]);
        }
      };
    };
  };

  // Печать выбранных актов
  const printSelected = () => {
    const selectedItems = tableData.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      alert("Чоп этиш учун абонентларни танланг!");
      return;
    }

    setPrinting(true);
    setItemsToPrint(selectedItems);
    setCurrentPrintIndex(0);

    // Начинаем печать первого абонента
    printOneSubscriber(selectedItems[0], 0);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Акт чоп этиш</h2>
      </div>

      <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Фильтрлар</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-cyan-400 text-sm mb-1">Йил</label>
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
          <div className="flex items-end">
            <button
              onClick={filterData}
              disabled={loading}
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg transition-all"
            >
              {loading ? "Юкланапти..." : "Кўриш"}
            </button>
          </div>
        </div>
      </div>

      {showData && (
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              {selectedYear} йил {months[selectedMonth - 1]} ойи учун абонентлар
            </h3>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all text-sm"
              >
                Ҳаммасини танлаш
              </button>
              <button
                onClick={deselectAll}
                className="px-3 py-1 rounded-lg bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 transition-all text-sm"
              >
                Тозалаш
              </button>
            </div>
          </div>

          {tableData.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Бу ой учун маълумот топилмади
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-white text-sm">
                  <thead className="border-b border-white/10 bg-white/5">
                    <tr>
                      <th className="text-center py-3 px-2 w-12">Танлаш</th>
                      <th className="text-left py-3 px-2">№</th>
                      <th className="text-left py-3 px-2">Абонент номи</th>
                      <th className="text-left py-3 px-2">АГТКШ рақами</th>
                      <th className="text-left py-3 px-2">Ҳисоблагич модели</th>
                      <th className="text-right py-3 px-2">Жами газ (м³)</th>
                      <th className="text-right py-3 px-2">
                        Ҳисоблагич бўйича (м³)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                        onClick={() => toggleSelect(item.id)}
                      >
                        <td className="text-center py-3 px-2">
                          {item.selected ? (
                            <CheckSquare className="w-5 h-5 text-cyan-400 inline" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400 inline" />
                          )}
                        </td>
                        <td className="py-3 px-2">{index + 1}</td>
                        <td className="py-3 px-2 font-medium">
                          {item.companyName}
                        </td>
                        <td className="py-3 px-2">
                          {item.agtkshNumber || "-"}
                        </td>
                        <td className="py-3 px-2">{item.meterModel}</td>
                        <td className="text-right py-3 px-2">
                          {formatNumber(item.totalGas)}
                        </td>
                        <td className="text-right py-3 px-2 text-cyan-300">
                          {formatNumber(item.byMeter)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={printSelected}
                  disabled={printing}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Printer className="w-5 h-5" />
                  {printing
                    ? `${currentPrintIndex + 1}/${itemsToPrint.length} чоп этилмоқда...`
                    : "Чоп этиш"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PrintAct;
