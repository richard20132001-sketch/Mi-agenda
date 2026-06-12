/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  ListTodo, 
  NotebookPen, 
  Check, 
  Trash2, 
  Plus, 
  Calendar, 
  Sparkles, 
  Smile, 
  Filter, 
  Clock, 
  BookOpen, 
  HeartHandshake, 
  ArrowRight,
  RefreshCw,
  Star,
  CheckCircle2,
  Bookmark
} from "lucide-react";

// Types
interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: boolean;
  createdAt: string;
}

interface DiaryEntry {
  id: string;
  text: string;
  moodId: string;
  timestamp: string;
  dateStr: string;
}

// Mood configurations
interface Mood {
  id: string;
  emoji: string;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
}

const MOODS: Mood[] = [
  { id: "grato", emoji: "💛", label: "Agradecido", bgColor: "bg-amber-50", textColor: "text-amber-800", borderColor: "border-amber-200", accentColor: "bg-amber-200" },
  { id: "tranquilo", emoji: "🍃", label: "Tranquilo", bgColor: "bg-emerald-50", textColor: "text-emerald-800", borderColor: "border-emerald-200", accentColor: "bg-emerald-200" },
  { id: "inspirado", emoji: "✨", label: "Inspirado", bgColor: "bg-purple-50", textColor: "text-purple-800", borderColor: "border-purple-200", accentColor: "bg-purple-200" },
  { id: "reflexivo", emoji: "☕", label: "Reflexivo", bgColor: "bg-stone-100", textColor: "text-stone-800", borderColor: "border-stone-300", accentColor: "bg-stone-300" },
  { id: "entusiasmado", emoji: "🔥", label: "Optimista", bgColor: "bg-orange-50", textColor: "text-orange-800", borderColor: "border-orange-200", accentColor: "bg-orange-200" },
];

const INTROSPECTIVE_PROMPTS = [
  "¿Qué pequeña cosa te hizo sonreír hoy?",
  "¿Por qué estás agradecido/a en este preciso momento?",
  "Describe un sonido, olor o imagen reconfortante de tu día.",
  "¿De qué logro, por pequeño que sea, te sientes orgulloso/a?",
  "¿Qué te enseñó la persona o situación más difícil de hoy?",
  "¿Cómo te sientes en una sola palabra y por qué?",
  "¿Qué acto de amabilidad recibiste o brindaste hoy?",
  "¿Qué te gustaría recordar de este día dentro de un año?"
];

export default function App() {
  // ---- LocalStorage Initialization ----
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("agenda_tasks");
    return saved ? JSON.parse(saved) : [
      { id: "1", text: "Regar las plantas y abrir las ventanas", completed: false, priority: false, createdAt: new Date().toLocaleDateString() },
      { id: "2", text: "Un momento de desconexión sin pantalla (15 min)", completed: true, priority: true, createdAt: new Date().toLocaleDateString() },
    ];
  });

  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem("diary_entries");
    return saved ? JSON.parse(saved) : [
      {
        id: "1",
        text: "Hoy caminé de regreso a casa por una ruta alternativa. Había pétalos amarillos de jacaranda cubriendo la acera y la brisa se sentía fresca. Me di cuenta de lo mucho que necesito desconectar y apreciar estos pequeños detalles de la ciudad.",
        moodId: "tranquilo",
        timestamp: "18:42",
        dateStr: "11 de junio, 2026"
      },
      {
        id: "2",
        text: "Pude avanzar y concluir un reporte laboral que me tenía con cierta inquietud hace días. Al fin me quité un peso de encima. Celebrando el pequeño avance de hoy con una muy buena taza de té de manzanilla.",
        moodId: "grato",
        timestamp: "21:15",
        dateStr: "11 de junio, 2026"
      }
    ];
  });

  // Save states to localstorage on change
  useEffect(() => {
    localStorage.setItem("agenda_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("diary_entries", JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  // ---- Interactive App States ----
  const [taskInput, setTaskInput] = useState("");
  const [taskFilter, setTaskFilter] = useState<"todas" | "pendientes" | "completadas">("todas");
  const [taskPriority, setTaskPriority] = useState(false);

  const [diaryInput, setDiaryInput] = useState("");
  const [selectedMoodId, setSelectedMoodId] = useState<string>("grato");
  const [promptIndex, setPromptIndex] = useState(0);

  // Dynamic Date Setup
  const [currentDateFormatted, setCurrentDateFormatted] = useState("");
  useEffect(() => {
    const getFormattedDate = () => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const formatted = new Date().toLocaleDateString('es-ES', options);
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    };
    setCurrentDateFormatted(getFormattedDate());
  }, []);

  // Shuffle prompts
  const shufflePrompt = () => {
    setPromptIndex((prev) => (prev + 1) % INTROSPECTIVE_PROMPTS.length);
  };

  // ---- Actions: Tasks ----
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: taskInput.trim(),
      completed: false,
      priority: taskPriority,
      createdAt: new Date().toLocaleDateString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setTaskInput("");
    setTaskPriority(false);
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const toggleTaskPriority = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority: !t.priority } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === "pendientes") return !t.completed;
    if (taskFilter === "completadas") return t.completed;
    return true;
  });

  // Sorted tasks check: priority tasks first
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (a.priority !== b.priority) {
      return a.priority ? -1 : 1;
    }
    return b.id.localeCompare(a.id);
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  // ---- Actions: Diary ----
  const handleSaveDiaryEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryInput.trim()) return;

    const today = new Date();
    const formattedDate = today.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const formattedTime = today.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      text: diaryInput.trim(),
      moodId: selectedMoodId,
      timestamp: formattedTime,
      dateStr: formattedDate,
    };

    setDiaryEntries((prev) => [newEntry, ...prev]);
    setDiaryInput("");
    // Randomize standard mood for next prompt
    setSelectedMoodId("grato");
    // Also skip to another gentle prompt trigger to keep user experience dynamic
    shufflePrompt();
  };

  const handleDeleteDiaryEntry = (id: string) => {
    setDiaryEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const activeMoodObj = MOODS.find(m => m.id === selectedMoodId) || MOODS[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#F5F2EB] to-[#EDE8DF] font-sans text-[#2e2a24] transition-all duration-300">
      {/* Decorative Top Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-200 via-stone-300 to-purple-200"></div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* ================= HEADER ================= */}
        <header className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full border border-stone-200/60 text-xs font-medium text-stone-600 mb-3 tracking-wide select-none">
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
              <span>Espacio de Introspección & Calma</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-[#3d372e] leading-snug">
              Agenda & Diario de Momentos
            </h1>
            <p className="text-stone-500 font-sans text-sm mt-1">
              Organiza lo esencial de tu día y atesora instantes que te trajeron paz.
            </p>
          </div>

          <div className="flex items-center justify-center md:justify-end gap-3 bg-white/70 backdrop-blur-sm shadow-xs border border-stone-200/50 rounded-2xl px-5 py-3 hover:bg-white transition-all">
            <Calendar className="w-5 h-5 text-stone-400 shrink-0" />
            <div className="text-left font-sans">
              <div className="text-xs text-stone-400 capitalize font-medium">Hoy</div>
              <div className="text-sm font-semibold text-stone-700">{currentDateFormatted || "..."}</div>
            </div>
          </div>
        </header>

        {/* ================= INTROSPECTIVE PROMPT SHUFFLER ================= */}
        <div className="mb-10 bg-[#FAF7F0] border border-amber-100 rounded-2xl p-4 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-4 items-start">
            <div className="bg-amber-100 p-2.5 rounded-xl shrink-0 mt-0.5 text-amber-800">
              <NotebookPen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wider text-amber-800 uppercase">Sugerencia reflexiva</span>
              <p className="text-base font-serif italic text-stone-700 mt-1">
                "{INTROSPECTIVE_PROMPTS[promptIndex]}"
              </p>
            </div>
          </div>
          <button
            onClick={shufflePrompt}
            type="button"
            className="inline-flex items-center justify-center gap-2 self-start md:self-center px-4 py-2 text-xs font-medium text-stone-600 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition duration-200 shadow-3xs group shrink-0 active:scale-95"
            id="shuffler-btn"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-400 group-hover:rotate-45 transition-transform" />
            <span>Siguiente reflexión</span>
          </button>
        </div>

        {/* ================= MAIN CONTENT LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT COLUMN: RECORDATORIOS/AGENDA (5 cols) ================= */}
          <section className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-md shadow-stone-200/50 border border-stone-100">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="bg-stone-50 p-2 rounded-lg text-stone-600 border border-stone-100">
                  <ListTodo className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-semibold text-stone-800">Cosas por Hacer</h2>
                  <p className="text-xs text-stone-400">Tus objetivos prácticos de hoy</p>
                </div>
              </div>

              <div className="px-3 py-1 bg-stone-50 rounded-full border border-stone-100 text-xs font-medium text-stone-500 font-mono">
                {completedCount}/{tasks.length} completas
              </div>
            </div>

            {/* TASK INPUT FORM */}
            <form onSubmit={handleAddTask} className="mb-6 space-y-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="Ej. Leer un capítulo de mi libro..."
                  className="w-full pl-4 pr-12 py-3 bg-[#FBFBFA] border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all placeholder:text-stone-400 font-sans"
                  id="task-input-field"
                />
                <button
                  type="submit"
                  disabled={!taskInput.trim()}
                  className="absolute right-2 p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:hover:bg-stone-800 text-white transition-all shrink-0 active:scale-95"
                  id="add-task-btn"
                  title="Añadir tarea"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Priority Toggle Indicator */}
              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() => setTaskPriority(!taskPriority)}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-all ${
                    taskPriority 
                      ? "text-amber-800 bg-amber-50 border border-amber-200" 
                      : "text-stone-400 hover:text-stone-600 hover:bg-stone-50 border border-transparent"
                  }`}
                  id="task-priority-toggle"
                >
                  <Star className={`w-3.5 h-3.5 ${taskPriority ? "fill-amber-400 text-amber-500" : ""}`} />
                  <span>Marcar como importante</span>
                </button>

                <p className="text-[11px] text-stone-400 italic">Pulsa Enter para añadir</p>
              </div>
            </form>

            {/* TASK FILTERS */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-stone-50 rounded-xl mb-4 text-xs font-medium text-stone-600 select-none">
              {(["todas", "pendientes", "completadas"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setTaskFilter(filter)}
                  className={`py-2 px-1 rounded-lg capitalize transition-all ${
                    taskFilter === filter
                      ? "bg-white text-stone-800 shadow-3xs font-medium"
                      : "hover:text-stone-900 text-stone-400"
                  }`}
                  id={`filter-${filter}`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* TASKS LIST */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {sortedTasks.length > 0 ? (
                  sortedTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                        task.completed
                          ? "bg-[#FAF9F6]/80 border-stone-200 text-stone-400"
                          : "bg-white hover:bg-stone-50/50 border-stone-200/80 hover:border-stone-200 text-stone-800"
                      } ${task.priority && !task.completed ? "border-l-4 border-l-amber-400" : ""}`}
                      id={`task-item-${task.id}`}
                    >
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleTaskCompleted(task.id)}
                        className={`mt-1.5 w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                          task.completed
                            ? "bg-stone-700 border-stone-700 text-white"
                            : "border-stone-300 hover:border-stone-400 bg-white"
                        }`}
                        id={`task-check-${task.id}`}
                      >
                        {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0" onClick={() => toggleTaskCompleted(task.id)}>
                        <p className={`text-sm break-words leading-relaxed cursor-pointer select-none ${
                          task.completed ? "line-through text-stone-400 decoration-1" : "font-sans font-normal"
                        }`}>
                          {task.text}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Toggle Priority */}
                        {!task.completed && (
                          <button
                            type="button"
                            onClick={() => toggleTaskPriority(task.id)}
                            className={`p-1 rounded-sm transition-all hover:bg-stone-100 ${
                              task.priority ? "text-amber-500" : "text-stone-300 hover:text-stone-400"
                            }`}
                            id={`task-priority-star-${task.id}`}
                            title={task.priority ? "Quitar prioridad" : "Hacer prioritaria"}
                          >
                            <Star className={`w-3.5 h-3.5 ${task.priority ? "fill-amber-400" : ""}`} />
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 rounded-sm text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all"
                          id={`task-delete-btn-${task.id}`}
                          title="Eliminar tarea"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10 px-4 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200"
                  >
                    <CheckCircle2 className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-stone-500 text-sm font-sans font-medium">Bandeja despejada</p>
                    <p className="text-stone-400 text-xs font-sans mt-0.5">
                      {taskFilter === "todas" 
                        ? "No tienes pendientes para hoy. ¡Disfruta tu día!" 
                        : `No hay tareas en el filtro "${taskFilter}".`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* ================= RIGHT COLUMN: DIARIO DE MOMENTOS (7 cols) ================= */}
          <section className="lg:col-span-7 space-y-8">
            
            {/* NEW ENTRY MAKER PANEL */}
            <div className="bg-white rounded-3xl p-6 shadow-md shadow-stone-200/50 border border-stone-100">
              <div className="flex items-center gap-2.5 border-b border-stone-100 pb-4 mb-5">
                <div className="bg-stone-50 p-2 rounded-lg text-stone-600 border border-stone-100">
                  <NotebookPen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-semibold text-stone-800">Momento Importante</h2>
                  <p className="text-xs text-stone-400">Captura un pensamiento, detalle especial o agradecimiento</p>
                </div>
              </div>

              {/* WRITE FORM */}
              <form onSubmit={handleSaveDiaryEntry} className="space-y-5">
                <div>
                  <label htmlFor="diary-textarea" className="block text-xs font-medium text-stone-500 mb-2">
                    Escribe tu relato o reflexión aquí
                  </label>
                  <textarea
                    id="diary-textarea"
                    rows={4}
                    value={diaryInput}
                    onChange={(e) => setDiaryInput(e.target.value)}
                    placeholder="Hoy me crucé con algo que llamó mi atención..."
                    className="w-full p-4 bg-[#FBFBFA] border border-stone-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all placeholder:text-stone-400 font-sans leading-relaxed resize-none"
                  ></textarea>
                </div>

                {/* MOOD PICKER */}
                <div>
                  <span className="block text-xs font-medium text-stone-500 mb-2.5">
                    ¿Cuál es el tono o espíritu de este momento?
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {MOODS.map((m) => {
                      const isSelected = selectedMoodId === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelectedMoodId(m.id)}
                          className={`flex items-center gap-2 px-3 py-2 text-xs rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? `${m.bgColor} ${m.textColor} ${m.borderColor} ring-2 ring-stone-200 ring-offset-1 font-semibold`
                              : "bg-white hover:bg-stone-50 border-stone-200 text-stone-600"
                          }`}
                          id={`mood-picker-${m.id}`}
                        >
                          <span className="text-base leading-none select-none">{m.emoji}</span>
                          <span className="truncate">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* FORM CONTROLS */}
                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-stone-400 flex items-center gap-1.5 font-sans">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-stone-300"></span>
                    <span>Tus notas quedan guardadas localmente</span>
                  </div>

                  <button
                    type="submit"
                    disabled={!diaryInput.trim()}
                    className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:hover:bg-stone-800 text-white font-medium text-xs md:text-sm px-5 py-2.5 rounded-xl md:rounded-xl transition duration-200 shadow-xs cursor-pointer active:scale-97 select-none"
                    id="save-diary-btn"
                  >
                    <span>Guardar en el Diario</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* CHRONOLOGICAL MOMENTS TIMELINE */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-stone-400" />
                  <h3 className="text-md font-serif font-semibold text-stone-700">Tus Recuerdos Guardados</h3>
                </div>
                <span className="text-xs text-stone-400 font-sans">{diaryEntries.length} entradas</span>
              </div>

              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {diaryEntries.length > 0 ? (
                    diaryEntries.map((entry) => {
                      const entryMoodObj = MOODS.find((m) => m.id === entry.moodId) || MOODS[0];

                      return (
                        <motion.article
                          key={entry.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          layout
                          className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-stone-200/60 hover:shadow-md hover:border-stone-200 transition-all flex gap-4"
                          id={`diary-card-${entry.id}`}
                        >
                          {/* Aesthetic Line Container with Mood indicator */}
                          <div className="hidden sm:flex flex-col items-center shrink-0">
                            <div className={`w-8 h-8 rounded-full ${entryMoodObj.bgColor} border ${entryMoodObj.borderColor} flex items-center justify-center text-sm shadow-2xs`}>
                              {entryMoodObj.emoji}
                            </div>
                            <div className="w-px h-full bg-stone-100 my-2"></div>
                          </div>

                          {/* Entry Body */}
                          <div className="flex-1 min-w-0">
                            {/* Entry Header Info */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100/70 pb-3 mb-3">
                              <div className="flex items-center gap-2">
                                {/* Mobile-only mood icon */}
                                <div className={`sm:hidden w-6 h-6 rounded-full ${entryMoodObj.bgColor} border ${entryMoodObj.borderColor} flex items-center justify-center text-xs`}>
                                  {entryMoodObj.emoji}
                                </div>
                                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${entryMoodObj.bgColor} ${entryMoodObj.textColor} border ${entryMoodObj.borderColor}`}>
                                  {entryMoodObj.label}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-xs text-stone-400 font-sans">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {entry.timestamp}
                                </span>
                                <span className="inline-block w-1 h-1 rounded-full bg-stone-300"></span>
                                <span>{entry.dateStr}</span>
                              </div>
                            </div>

                            {/* Main narrative text */}
                            <p className="text-stone-700/90 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                              {entry.text}
                            </p>

                            {/* Actions / Utilities */}
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100/60">
                              <div className="flex items-center gap-1.5 text-xs text-stone-400">
                                <BookOpen className="w-3.5 h-3.5 text-stone-300" />
                                <span>Instante guardado</span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteDiaryEntry(entry.id)}
                                className="flex items-center gap-1 text-[11px] font-medium text-stone-400 hover:text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all"
                                id={`diary-delete-btn-${entry.id}`}
                                title="Borrar entrada"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Eliminar registro</span>
                              </button>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 px-6 bg-white rounded-2xl border border-stone-200/80 shadow-3xs"
                    >
                      <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                      <h4 className="text-stone-600 font-serif font-semibold text-base mb-1">Tu diario de hoy está en blanco</h4>
                      <p className="text-stone-400 text-sm font-sans max-w-sm mx-auto">
                        ¿Qué tal si respondes a la sugerencia de arriba o añades un pequeño detalle especial para inaugurar tu día?
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </section>

        </div>

        {/* ================= COZY FOOTER ================= */}
        <footer className="mt-16 pt-8 border-t border-stone-200/80 text-center text-stone-400 text-xs font-sans">
          <div className="flex items-center justify-center gap-1.5 mb-2 text-[#80766B]">
            <HeartHandshake className="w-4 h-4 text-emerald-500" />
            <span className="font-medium">Un rincón de calma en tu rutina diaria</span>
          </div>
          <p>© {new Date().getFullYear()} — Agenda y Diario de Momentos. Construido con elegancia y serenidad.</p>
        </footer>

      </div>
    </div>
  );
}
