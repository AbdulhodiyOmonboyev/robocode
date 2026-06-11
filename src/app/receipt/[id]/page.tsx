"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

function money(v: any) { return Number(v || 0).toLocaleString("ru-RU"); }
const METHODS: Record<string, string> = { cash: "Naqd", card: "Karta", transfer: "O'tkazma" };

export default function ReceiptPage() {
  const params = useParams();
  const id = params?.id as string;
  const [p, setP] = useState<any>(null);
  const [brand, setBrand] = useState<any>({ name: "Robocode CRM", logo: "" });
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/payments/${id}`).then(r => r.ok ? r.json() : Promise.reject()).then(setP).catch(() => setErr(true));
    fetch("/api/branding").then(r => r.json()).then(setBrand).catch(() => {});
  }, [id]);

  if (err) return <div className="p-10 text-center text-gray-400">To'lov topilmadi</div>;
  if (!p) return <div className="p-10 text-center text-gray-400">Yuklanmoqda...</div>;

  const row = (label: string, value: any) => (
    <div className="flex justify-between gap-3 py-1 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 text-right">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 print:bg-white print:py-0">
      <div className="mb-4 flex gap-2 print:hidden">
        <button onClick={() => window.print()} className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl">Chop etish</button>
        <button onClick={() => window.close()} className="px-5 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-xl">Yopish</button>
      </div>

      <div id="receipt" className="bg-white w-[340px] p-6 rounded-2xl shadow-lg print:shadow-none print:w-full print:max-w-[340px]">
        <div className="text-center mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={brand.logo || "/icon.svg"} alt="" className="inline-block w-12 h-12 rounded-xl mb-2 object-contain" />
          <h1 className="text-lg font-bold text-gray-900">{brand.name}</h1>
          <p className="text-xs text-gray-500 mt-0.5">TO'LOV CHEKI</p>
        </div>

        <div className="border-t border-dashed border-gray-300 my-3" />

        {row("Sana", new Date(p.paidAt).toLocaleDateString("ru-RU"))}
        {row("O'quvchi", p.lead?.fullName || "—")}
        {p.lead?.phone && row("Telefon", p.lead.phone)}
        {p.courseName && row("Kurs", p.courseName)}
        {p.forMonth && row("Oy", p.forMonth)}
        {row("To'lov usuli", METHODS[p.method] || p.method)}
        {p.discount && Number(p.discount) > 0 ? row("Chegirma", `${money(p.discount)} so'm`) : null}

        <div className="border-t border-dashed border-gray-300 my-3" />

        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Jami</span>
          <span className="text-xl font-bold text-green-600">{money(p.amount)} so'm</span>
        </div>

        <div className="border-t border-dashed border-gray-300 my-3" />

        <p className="text-xs text-gray-500 text-center">Qabul qildi: {p.createdBy?.fullName || "—"}</p>
        <p className="text-center text-xs text-gray-400 mt-3">Rahmat! 🟣</p>
      </div>

      <style>{`@media print { @page { margin: 10mm; } body { background: #fff !important; } }`}</style>
    </div>
  );
}
