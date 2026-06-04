"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Phone, MessageCircle } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, KANBAN_COLUMNS, SIDE_COLUMNS } from "@/lib/constants";
import { formatPhone, phoneToTel, phoneToTelegram } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const COLUMN_COLORS: Record<string, string> = {
  NEW: "border-t-blue-400", CONTACTED: "border-t-yellow-400", INTERESTED: "border-t-orange-400",
  TRIAL_BOOKED: "border-t-purple-400", TRIAL_COMPLETED: "border-t-cyan-400", ENROLLED: "border-t-emerald-400",
  POSTPONED: "border-t-gray-400", LOST: "border-t-red-400",
};

interface Lead {
  id: string; fullName: string; phone: string; status: string;
  course: { name: string; color: string | null } | null;
  assignedTo: { fullName: string } | null;
  createdAt: string;
}

type Board = Record<string, Lead[]>;

export default function KanbanPage() {
  const [board, setBoard] = useState<Board>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/leads?limit=200");
    if (res.ok) {
      const { leads } = await res.json();
      const grouped: Board = {};
      [...KANBAN_COLUMNS, ...SIDE_COLUMNS].forEach(s => (grouped[s] = []));
      leads.forEach((l: Lead) => {
        if (grouped[l.status]) grouped[l.status].push(l);
      });
      setBoard(grouped);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

    const srcCol = source.droppableId;
    const dstCol = destination.droppableId;

    // Optimistic update
    const srcItems = [...board[srcCol]];
    const dstItems = srcCol === dstCol ? srcItems : [...board[dstCol]];
    const [moved] = srcItems.splice(source.index, 1);
    moved.status = dstCol;
    dstItems.splice(destination.index, 0, moved);

    setBoard(b => ({
      ...b,
      [srcCol]: srcItems,
      [dstCol]: dstItems,
    }));

    const res = await fetch(`/api/leads/${draggableId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: dstCol }),
    });
    if (!res.ok) { toast.error("Status o'zgartirilmadi"); load(); }
    else toast.success(`Status → ${LEAD_STATUS_LABELS[dstCol as keyof typeof LEAD_STATUS_LABELS]}`);
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map(s => (
          <div key={s} className="flex-shrink-0 w-64 h-96 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 animate-pulse"/>
        ))}
      </div>
    );
  }

  const allColumns = [...KANBAN_COLUMNS, ...SIDE_COLUMNS];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban</h1>
          <p className="text-sm text-gray-500 mt-0.5">Lidlarni drag & drop bilan boshqaring</p>
        </div>
        <div className="flex gap-2">
          <Link href="/leads"><Button variant="outline" size="sm">Jadval ko'rinish</Button></Link>
          <Link href="/leads/new"><Button size="sm"><Plus className="w-4 h-4"/> Yangi lid</Button></Link>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {allColumns.map(status => {
            const items = board[status] || [];
            return (
              <div key={status} className={`flex-shrink-0 w-64 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-t-4 ${COLUMN_COLORS[status]} border border-gray-200 dark:border-gray-700 flex flex-col`}>
                {/* Column header */}
                <div className="px-3 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    {LEAD_STATUS_LABELS[status as keyof typeof LEAD_STATUS_LABELS]}
                  </h3>
                  <span className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full font-medium">
                    {items.length}
                  </span>
                </div>

                {/* Cards */}
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2 space-y-2 min-h-[200px] transition-colors ${snapshot.isDraggingOver ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""}`}
                    >
                      {items.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm transition-shadow ${snapshot.isDragging ? "shadow-xl rotate-1" : "hover:shadow-md"}`}
                            >
                              <Link href={`/leads/${lead.id}`} onClick={e => { if (snapshot.isDragging) e.preventDefault(); }}>
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
                                  <a href={phoneToTel(lead.phone)} onClick={e=>e.stopPropagation()} className="p-1 text-gray-400 hover:text-green-600 rounded transition">
                                    <Phone className="w-3 h-3"/>
                                  </a>
                                  <a href={phoneToTelegram(lead.phone)} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="p-1 text-gray-400 hover:text-blue-500 rounded transition">
                                    <MessageCircle className="w-3 h-3"/>
                                  </a>
                                </div>
                              </div>
                              {lead.assignedTo && (
                                <p className="text-xs text-gray-400 mt-1">{lead.assignedTo.fullName}</p>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {items.length === 0 && !snapshot.isDraggingOver && (
                        <div className="h-16 flex items-center justify-center text-xs text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                          Bo'sh
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
