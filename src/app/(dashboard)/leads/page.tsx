"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Filter, Download, Phone, MessageCircle, Edit, Trash2, LayoutGrid, List, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, LEAD_SOURCE_LABELS } from "@/lib/constants";
import { formatDate, formatPhone, phoneToTel, phoneToTelegram, phoneToWhatsapp } from "@/lib/utils";

interface Lead {
  id: string; fullName: string; phone: string; email: string | null;
  status: string; source: string; createdAt: string; lastContactedAt: string | null;
  course: { id: string; name: string; color: string | null } | null;
  timeSlot: { label: string } | null;
  assignedTo: { id: string; fullName: string } | null;
}

interface Course { id: string; name: string; }
interface User { id: string; fullName: string; }

export default function LeadsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    status: "", courseId: "", source: "", assignedToId: "",
    dateFrom: "", dateTo: "", timePreference: "", page: 1,
  });

  const loadLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    const res = await fetch(`/api/leads?${params}`);
    if (res.ok) {
      const data = await res.json();
      setLeads(data.leads); setTotal(data.total); setPages(data.pages);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => { loadLeads(); }, [loadLeads]);
  useEffect(() => {
    fetch("/api/courses").then(r=>r.json()).then(setCourses);
    fetch("/api/users").then(r=>r.json()).then(setUsers);
  }, []);

  const setFilter = (key: string, value: string) =>
    setFilters(f => ({ ...f, [key]: value, page: 1 }));

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () =>
    setSelected(selected.size === leads.length ? new Set() : new Set(leads.map(l=>l.id)));

  const handleDelete = async (id: string) => {
    if (!confirm("Bu lidni o'chirishni tasdiqlaysizmi?")) return;
    const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Lid o'chirildi"); loadLeads(); }
    else toast.error("O'chirib bo'lmadi");
  };

  const handleBulkStatusChange = async (status: string) => {
    if (!selected.size) return;
    await Promise.all([...selected].map(id =>
      fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
    ));
    toast.success(`${selected.size} ta lid holati o'zgartirildi`);
    setSelected(new Set()); loadLeads();
  };

  const exportCSV = async () => {
    const res = await fetch("/api/reports/export?format=csv");
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "leads.csv"; a.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lidlar</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} ta natija</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={()=>setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4"/> Filtrlar
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4"/> Export
          </Button>
          <Link href="/leads/kanban"><Button variant="outline" size="sm"><LayoutGrid className="w-4 h-4"/> Kanban</Button></Link>
          <Link href="/leads/new"><Button size="sm"><Plus className="w-4 h-4"/> Yangi lid</Button></Link>
        </div>
      </div>

      {/* Search + Filters */}
      <Card>
        <div className="p-4 space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
              <input value={filters.search} onChange={e=>setFilter("search",e.target.value)}
                placeholder="Ism, telefon yoki email..." type="text"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>
            <select value={filters.status} onChange={e=>setFilter("status",e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Barcha statuslar</option>
              {Object.entries(LEAD_STATUS_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          {showFilters && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-gray-100 dark:border-gray-800">
              <select value={filters.courseId} onChange={e=>setFilter("courseId",e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Barcha kurslar</option>
                {courses.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={filters.source} onChange={e=>setFilter("source",e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Barcha manbalar</option>
                {Object.entries(LEAD_SOURCE_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
              <select value={filters.assignedToId} onChange={e=>setFilter("assignedToId",e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Barcha hodimlar</option>
                <option value="unassigned">Tayinlanmagan</option>
                {users.map(u=><option key={u.id} value={u.id}>{u.fullName}</option>)}
              </select>
              <div className="flex gap-2">
                <input type="date" value={filters.dateFrom} onChange={e=>setFilter("dateFrom",e.target.value)}
                  className="flex-1 px-2 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <input type="date" value={filters.dateTo} onChange={e=>setFilter("dateTo",e.target.value)}
                  className="flex-1 px-2 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              </div>
            </div>
          )}
        </div>

        {/* Bulk actions bar */}
        {selected.size > 0 && (
          <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border-t border-indigo-100 dark:border-indigo-800 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">{selected.size} ta tanlandi</span>
            <select onChange={e=>{ if(e.target.value) handleBulkStatusChange(e.target.value); e.target.value=""; }}
              className="px-2 py-1 text-xs border border-indigo-300 dark:border-indigo-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
              <option value="">Status o'zgartirish...</option>
              {Object.entries(LEAD_STATUS_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
            <button onClick={()=>setSelected(new Set())} className="text-xs text-indigo-500 hover:underline">Bekor</button>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="p-10 text-center text-gray-400 animate-pulse">Yuklanmoqda...</div>
        ) : leads.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-5xl mb-4">👥</div>
            <p className="text-gray-500 font-medium">Hech qanday lid topilmadi</p>
            <Link href="/leads/new"><Button className="mt-4"><Plus className="w-4 h-4"/>Yangi lid qo'shish</Button></Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-gray-100 dark:border-gray-800">
                  <th className="px-4 py-3">
                    <input type="checkbox" checked={selected.size===leads.length && leads.length>0}
                      onChange={toggleAll} className="h-4 w-4 rounded border-gray-300 text-indigo-600"/>
                  </th>
                  {["Ism","Telefon","Kurs","Vaqt","Status","Manba","Mas'ul","Sana",""].map(h=>(
                    <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {leads.map(lead=>(
                  <tr key={lead.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition ${selected.has(lead.id)?"bg-indigo-50/50 dark:bg-indigo-900/10":""}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(lead.id)} onChange={()=>toggleSelect(lead.id)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600"/>
                    </td>
                    <td className="px-3 py-3">
                      <Link href={`/leads/${lead.id}`} className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 transition text-sm">
                        {lead.fullName}
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <a href={phoneToTel(lead.phone)} className="text-sm text-indigo-600 hover:underline font-mono">{formatPhone(lead.phone)}</a>
                    </td>
                    <td className="px-3 py-3">
                      {lead.course ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-lg" style={{ backgroundColor: (lead.course.color||"#6366f1")+"20", color: lead.course.color||"#6366f1" }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: lead.course.color||"#6366f1"}}/>
                          {lead.course.name}
                        </span>
                      ) : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500">{lead.timeSlot?.label || "—"}</td>
                    <td className="px-3 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${LEAD_STATUS_COLORS[lead.status as keyof typeof LEAD_STATUS_COLORS]}`}>
                        {LEAD_STATUS_LABELS[lead.status as keyof typeof LEAD_STATUS_LABELS]}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500">{LEAD_SOURCE_LABELS[lead.source as keyof typeof LEAD_SOURCE_LABELS]}</td>
                    <td className="px-3 py-3 text-xs text-gray-500">{lead.assignedTo?.fullName || <span className="text-gray-300">—</span>}</td>
                    <td className="px-3 py-3 text-xs text-gray-400">{formatDate(lead.createdAt)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <a href={phoneToTel(lead.phone)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="Qo'ng'iroq"><Phone className="w-3.5 h-3.5"/></a>
                        <a href={phoneToTelegram(lead.phone)} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Telegram"><MessageCircle className="w-3.5 h-3.5"/></a>
                        <Link href={`/leads/${lead.id}`} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Tahrirlash"><Edit className="w-3.5 h-3.5"/></Link>
                        <button onClick={()=>handleDelete(lead.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-sm text-gray-500">{total} ta natijadan {((filters.page-1)*20)+1}–{Math.min(filters.page*20,total)} ko'rsatilmoqda</span>
            <div className="flex items-center gap-2">
              <button onClick={()=>setFilters(f=>({...f,page:f.page-1}))} disabled={filters.page<=1}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <ChevronLeft className="w-4 h-4"/>
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">{filters.page} / {pages}</span>
              <button onClick={()=>setFilters(f=>({...f,page:f.page+1}))} disabled={filters.page>=pages}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <ChevronRight className="w-4 h-4"/>
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
