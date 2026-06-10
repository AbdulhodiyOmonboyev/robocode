"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Phone, MessageCircle, Download, Settings2, Trash2, ChevronLeft, ChevronRight, Check, X, ChevronsLeft, ChevronsRight } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { formatPhone, phoneToTel, phoneToTelegram } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Stage { id: string; name: string; color: string; order: number; isWon: boolean; isLost: boolean; }
interface Lead {
  id: string; fullName: string; phone: string; stageId: string | null;
  course: { name: string; color: string | null } | null;
  assignedTo: { fullName: string } | null;
}
type Board = Record<string, Lead[]>;

const SWATCHES = ["#3b82f6","#6366f1","#8b5cf6","#a855f7","#ec4899","#f43f5e","#ef4444","#f97316","#f59e0b","#eab308","#10b981","#06b6d4","#14b8a6","#6b7280"];

export default function KanbanPage() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [board, setBoard] = useState<Board>({});
  const [loading, setLoading] = useState(true);
  const [manage, setManage] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [addingCol, setAddingCol] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [colorOpen, setColorOpen] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  useEffect(() => {
    try { const s = localStorage.getItem("kanbanCollapsed"); if (s) setCollapsed(new Set(JSON.parse(s))); } catch {}
  }, []);
  const persist = (n: Set<string>) => { try { localStorage.setItem("kanbanCollapsed", JSON.stringify([...n])); } catch {} };
  const toggleCollapse = (id: string) => setCollapsed(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); persist(n); return n; });
  const collapseEmpty = () => { const n = new Set(collapsed); stages.forEach(s => { if ((board[s.id] || []).length === 0) n.add(s.id); }); setCollapsed(n); persist(n); };
  const expandAll = () => { setCollapsed(new Set()); persist(new Set()); };

  const load = async () => {
    setLoading(true);
    const [st, lr] = await Promise.all([
      fetch("/api/stages").then(r => r.json()),
      fetch("/api/leads?limit=500").then(r => r.json()),
    ]);
    const stageList: Stage[] = Array.isArray(st) ? st : [];
    setStages(stageList);
    const grouped: Board = {};
    stageList.forEach(s => (grouped[s.id] = []));
    const firstId = stageList[0]?.id;
    (lr.leads || []).forEach((l: Lead) => {
      const key = l.stageId && grouped[l.stageId] ? l.stageId : firstId;
      if (key && grouped[key]) grouped[key].push(l);
    });
    setBoard(grouped);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;
    const srcCol = source.droppableId, dstCol = destination.droppableId;
    const srcItems = [...board[srcCol]];
    const dstItems = srcCol === dstCol ? srcItems : [...board[dstCol]];
    const [moved] = srcItems.splice(source.index, 1);
    moved.stageId = dstCol;
    dstItems.splice(destination.index, 0, moved);
    setBoard(b => ({ ...b, [srcCol]: srcItems, [dstCol]: dstItems }));

    const res = await fetch(`/api/leads/${draggableId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stageId: dstCol }),
    });
    if (!res.ok) { toast.error("Ko'chirib bo'lmadi"); load(); }
    else { const s = stages.find(x => x.id === dstCol); toast.success(`→ ${s?.name || ""}`); }
  };

  const addStage = async () => {
    if (newColName.trim().length < 1) { toast.error("Ustun nomini kiriting"); return; }
    setAddingCol(true);
    const res = await fetch("/api/stages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newColName.trim() }),
    });
    if (res.ok) { setNewColName(""); toast.success("Ustun qo'shildi"); load(); }
    else toast.error("Qo'shib bo'lmadi (ruxsat kerak)");
    setAddingCol(false);
  };

  const renameStage = async (id: string) => {
    const name = nameDraft.trim();
    setEditingName(null);
    if (!name) return;
    const res = await fetch(`/api/stages/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) { setStages(s => s.map(x => x.id === id ? { ...x, name } : x)); }
    else toast.error("O'zgartirib bo'lmadi");
  };

  const recolor = async (id: string, color: string) => {
    setColorOpen(null);
    setStages(s => s.map(x => x.id === id ? { ...x, color } : x));
    await fetch(`/api/stages/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color }),
    });
  };

  const deleteStage = async (id: string) => {
    if (!confirm("Bu ustunni o'chirasizmi? Ichidagi lidlar birinchi ustunga ko'chiriladi.")) return;
    const res = await fetch(`/api/stages/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Ustun o'chirildi"); load(); }
    else toast.error("O'chirib bo'lmadi");
  };

  const moveStage = async (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= stages.length) return;
    const a = stages[index], b = stages[j];
    setStages(s => { const c = [...s]; [c[index], c[j]] = [c[j], c[index]]; return c; });
    await Promise.all([
      fetch(`/api/stages/${a.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: b.order }) }),
      fetch(`/api/stages/${b.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: a.order }) }),
    ]);
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1,2,3,4,5].map(s => (
          <div key={s} className="flex-shrink-0 w-64 h-96 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 animate-pulse"/>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban</h1>
          <p className="text-sm text-gray-500 mt-0.5">Lidlarni drag &amp; drop bilan boshqaring</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={collapsed.size > 0 ? expandAll : collapseEmpty}>
            {collapsed.size > 0 ? <><ChevronsRight className="w-4 h-4"/> Hammasini ochish</> : <><ChevronsLeft className="w-4 h-4"/> Bo&apos;shlarni yig&apos;ish</>}
          </Button>
          <Button variant={manage ? "primary" : "outline"} size="sm" onClick={()=>setManage(m=>!m)}>
            <Settings2 className="w-4 h-4"/> {manage ? "Tayyor" : "Ustunlar"}
          </Button>
          <a href="/api/reports/export" download>
            <Button variant="outline" size="sm"><Download className="w-4 h-4"/> Excel</Button>
          </a>
          <Link href="/leads"><Button variant="outline" size="sm">Jadval</Button></Link>
          <Link href="/leads/new"><Button size="sm"><Plus className="w-4 h-4"/> Yangi lid</Button></Link>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4 items-start">
          {stages.map((stage, index) => {
            const items = board[stage.id] || [];
            if (collapsed.has(stage.id) && !manage) {
              return (
                <button key={stage.id} onClick={()=>toggleCollapse(stage.id)} title="Ochish"
                  className="flex-shrink-0 w-11 self-stretch min-h-[260px] bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-t-4 border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  style={{ borderTopColor: stage.color }}>
                  <ChevronsRight className="w-4 h-4 text-gray-400"/>
                  <span className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full font-medium">{items.length}</span>
                  <span className="mt-1 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide" style={{ writingMode: "vertical-rl" }}>{stage.name}</span>
                </button>
              );
            }
            return (
              <div key={stage.id} className="flex-shrink-0 w-64 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-t-4 border border-gray-200 dark:border-gray-700 flex flex-col" style={{ borderTopColor: stage.color }}>
                {/* Column header */}
                <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-700">
                  {!manage ? (
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide truncate">{stage.name}</h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full font-medium">{items.length}</span>
                        <button onClick={()=>toggleCollapse(stage.id)} className="p-0.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" title="Yig'ish"><ChevronsLeft className="w-3.5 h-3.5"/></button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        {editingName === stage.id ? (
                          <input autoFocus value={nameDraft} onChange={e=>setNameDraft(e.target.value)}
                            onKeyDown={e=>{ if(e.key==="Enter") renameStage(stage.id); if(e.key==="Escape") setEditingName(null); }}
                            onBlur={()=>renameStage(stage.id)}
                            className="flex-1 min-w-0 px-2 py-1 text-xs border border-indigo-300 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none"/>
                        ) : (
                          <button onClick={()=>{ setEditingName(stage.id); setNameDraft(stage.name); }}
                            className="flex-1 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase truncate hover:text-indigo-600">{stage.name}</button>
                        )}
                        <button onClick={()=>setColorOpen(colorOpen===stage.id?null:stage.id)} className="w-5 h-5 rounded-full border border-white dark:border-gray-700 shadow flex-shrink-0" style={{ backgroundColor: stage.color }} title="Rang"/>
                      </div>
                      {colorOpen === stage.id && (
                        <div className="flex flex-wrap gap-1 p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                          {SWATCHES.map(c => (
                            <button key={c} onClick={()=>recolor(stage.id, c)} className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: c }}/>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          <button onClick={()=>moveStage(index,-1)} disabled={index===0} className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronLeft className="w-3.5 h-3.5"/></button>
                          <button onClick={()=>moveStage(index,1)} disabled={index===stages.length-1} className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronRight className="w-3.5 h-3.5"/></button>
                        </div>
                        <button onClick={()=>deleteStage(stage.id)} className="p-1 rounded text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                    </div>
                  )}
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}
                      className={`flex-1 p-2 space-y-2 min-h-[200px] transition-colors ${snapshot.isDraggingOver ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""}`}>
                      {items.map((lead, idx) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={idx}>
                          {(prov, snap) => (
                            <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}
                              className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm transition-shadow ${snap.isDragging ? "shadow-xl rotate-1" : "hover:shadow-md"}`}>
                              <Link href={`/leads/${lead.id}`} onClick={e => { if (snap.isDragging) e.preventDefault(); }}>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1 hover:text-indigo-600 transition">{lead.fullName}</p>
                              </Link>
                              {lead.course && (
                                <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-lg mb-2" style={{ backgroundColor: (lead.course.color||"#6366f1")+"15", color: lead.course.color||"#6366f1" }}>
                                  <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:lead.course.color||"#6366f1"}}/>
                                  {lead.course.name}
                                </span>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500 font-mono">{formatPhone(lead.phone)}</span>
                                <div className="flex gap-1">
                                  <a href={phoneToTel(lead.phone)} onClick={e=>e.stopPropagation()} className="p-1 text-gray-400 hover:text-green-600 rounded transition"><Phone className="w-3 h-3"/></a>
                                  <a href={phoneToTelegram(lead.phone)} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="p-1 text-gray-400 hover:text-blue-500 rounded transition"><MessageCircle className="w-3 h-3"/></a>
                                </div>
                              </div>
                              {lead.assignedTo && <p className="text-xs text-gray-400 mt-1">{lead.assignedTo.fullName}</p>}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {items.length === 0 && !snapshot.isDraggingOver && (
                        <div className="h-16 flex items-center justify-center text-xs text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">Bo&apos;sh</div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}

          {/* Add column */}
          {manage && (
            <div className="flex-shrink-0 w-64 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Yangi ustun</p>
              <input value={newColName} onChange={e=>setNewColName(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") addStage(); }}
                placeholder="Ustun nomi"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 mb-2"/>
              <Button size="sm" className="w-full" loading={addingCol} onClick={addStage}><Plus className="w-4 h-4"/> Qo&apos;shish</Button>
            </div>
          )}
        </div>
      </DragDropContext>
    </div>
  );
}
