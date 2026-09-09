import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { DIAS } from './types';
import type { Categoria, DiaSemana, EstadoApp, Habito, Nota, Tarea } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generarId } from './utils/helpers';
import { Header } from './components/Header';
import { DayColumn } from './components/DayColumn';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { ConfirmModal } from './components/ConfirmModal';
import { Habitos } from './components/Habitos';
import { Notas } from './components/Notas';

const CATEGORIAS_INICIALES: Categoria[] = [
  { id: 'cat-trabajo', nombre: 'Trabajo', color: 'musgo-500' },
  { id: 'cat-personal', nombre: 'Personal', color: 'musgo-300' },
  { id: 'cat-salud', nombre: 'Salud', color: 'salvia-300' },
];

const ESTADO_INICIAL: EstadoApp = {
  tareas: [],
  categorias: CATEGORIAS_INICIALES,
  habitos: [],
  notas: [],
};

function diaDeHoy(): DiaSemana {
  const indice = new Date().getDay(); // 0 = domingo
  const mapa: DiaSemana[] = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
  return mapa[indice];
}

type Tema = 'claro' | 'oscuro' | 'oscuro-pro' | 'fantasma' | 'hielo';

type Vista = 'horizontal' | 'vertical';

export default function App() {
  const [estado, setEstado] = useLocalStorage<EstadoApp>('plan-semanal-estado', ESTADO_INICIAL);
  const [tema, setTema] = useLocalStorage<Tema>('plan-semanal-tema', 'claro');
  const [vista, setVista] = useLocalStorage<Vista>('plan-semanal-vista', 'horizontal');
  const [busqueda, setBusqueda] = useState('');
  const [modalTarea, setModalTarea] = useState<{ tarea: Tarea | null; dia: DiaSemana } | null>(null);
  const [confirmando, setConfirmando] = useState<
    | { tipo: 'reset' }
    | { tipo: 'eliminar-tarea'; tarea: Tarea }
    | { tipo: 'eliminar-habito'; habito: Habito }
    | { tipo: 'eliminar-nota'; nota: Nota }
    | null
  >(null);
  const [idArrastrando, setIdArrastrando] = useState<string | null>(null);
  const hoy = diaDeHoy();

  useEffect(() => {
    const temas: Record<Tema, string> = {
      claro: 'claro',
      oscuro: 'dark',
      'oscuro-pro': 'oscuro-pro',
      fantasma: 'fantasma',
      hielo: 'hielo',
    };

    const current = temas[tema];
    document.documentElement.dataset.theme = current;
    document.documentElement.classList.toggle(
      'dark',
      current === 'dark' || current === 'oscuro-pro' || current === 'fantasma'
    );
    document.documentElement.classList.toggle('theme-fantasma', current === 'fantasma');
    document.documentElement.classList.toggle('theme-oscuro-pro', current === 'oscuro-pro');
    document.documentElement.classList.toggle('theme-hielo', current === 'hielo');
  }, [tema]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const tareasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return estado.tareas;
    return estado.tareas.filter((t) => t.texto.toLowerCase().includes(q));
  }, [estado.tareas, busqueda]);

  const tareasPorDia = (dia: DiaSemana) =>
    tareasFiltradas.filter((t) => t.dia === dia).sort((a, b) => a.orden - b.orden);

  // ---- Tareas ----
  function agregarTarea(datos: { texto: string; dia: DiaSemana; categoriaId: string | null; prioridad: 1 | 2 | 3 }) {
    const ordenMax = Math.max(0, ...estado.tareas.filter((t) => t.dia === datos.dia).map((t) => t.orden));
    const nueva: Tarea = {
      id: generarId(),
      texto: datos.texto,
      dia: datos.dia,
      categoriaId: datos.categoriaId,
      prioridad: datos.prioridad,
      completada: false,
      orden: ordenMax + 1,
      creadaEn: Date.now(),
    };
    setEstado((s) => ({ ...s, tareas: [...s.tareas, nueva] }));
    setModalTarea(null);
  }

  function editarTarea(
    id: string,
    datos: { texto: string; dia: DiaSemana; categoriaId: string | null; prioridad: 1 | 2 | 3 }
  ) {
    setEstado((s) => ({
      ...s,
      tareas: s.tareas.map((t) => (t.id === id ? { ...t, ...datos } : t)),
    }));
    setModalTarea(null);
  }

  function toggleTarea(id: string) {
    setEstado((s) => ({
      ...s,
      tareas: s.tareas.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t)),
    }));
  }

  function eliminarTarea(id: string) {
    setEstado((s) => ({ ...s, tareas: s.tareas.filter((t) => t.id !== id) }));
    setConfirmando(null);
  }

  function duplicarTarea(t: Tarea) {
    const ordenMax = Math.max(0, ...estado.tareas.filter((x) => x.dia === t.dia).map((x) => x.orden));
    const copia: Tarea = { ...t, id: generarId(), orden: ordenMax + 1, creadaEn: Date.now(), completada: false };
    setEstado((s) => ({ ...s, tareas: [...s.tareas, copia] }));
  }

  // ---- Drag & drop ----
  function handleDragStart(e: DragStartEvent) {
    setIdArrastrando(String(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setIdArrastrando(null);
    const { active, over } = e;
    if (!over) return;

    const tareaActiva = estado.tareas.find((t) => t.id === active.id);
    if (!tareaActiva) return;

    const overEsDia = DIAS.some((d) => d.key === over.id);
    const diaDestino = overEsDia ? (over.id as DiaSemana) : estado.tareas.find((t) => t.id === over.id)?.dia;
    if (!diaDestino) return;

    setEstado((s) => {
      let tareas = [...s.tareas];

      if (tareaActiva.dia !== diaDestino) {
        // Mover a otro día: al final de ese día
        const ordenMax = Math.max(0, ...tareas.filter((t) => t.dia === diaDestino).map((t) => t.orden));
        tareas = tareas.map((t) => (t.id === tareaActiva.id ? { ...t, dia: diaDestino, orden: ordenMax + 1 } : t));
      } else if (!overEsDia && active.id !== over.id) {
        // Reordenar dentro del mismo día
        const idsDelDia = tareas
          .filter((t) => t.dia === diaDestino)
          .sort((a, b) => a.orden - b.orden)
          .map((t) => t.id);
        const oldIndex = idsDelDia.indexOf(String(active.id));
        const newIndex = idsDelDia.indexOf(String(over.id));
        if (oldIndex === -1 || newIndex === -1) return s;
        const nuevoOrden = arrayMove(idsDelDia, oldIndex, newIndex);
        const ordenPorId = new Map(nuevoOrden.map((id, i) => [id, i]));
        tareas = tareas.map((t) => (ordenPorId.has(t.id) ? { ...t, orden: ordenPorId.get(t.id)! } : t));
      }

      return { ...s, tareas };
    });
  }

  const tareaArrastrando = idArrastrando ? estado.tareas.find((t) => t.id === idArrastrando) ?? null : null;

  // ---- Hábitos ----
  function agregarHabito(texto: string) {
    const nuevo: Habito = { id: generarId(), texto, completadoDias: {} };
    setEstado((s) => ({ ...s, habitos: [...s.habitos, nuevo] }));
  }
  function toggleHabitoDia(id: string, dia: DiaSemana) {
    setEstado((s) => ({
      ...s,
      habitos: s.habitos.map((h) =>
        h.id === id ? { ...h, completadoDias: { ...h.completadoDias, [dia]: !h.completadoDias[dia] } } : h
      ),
    }));
  }
  function eliminarHabito(id: string) {
    setEstado((s) => ({ ...s, habitos: s.habitos.filter((h) => h.id !== id) }));
    setConfirmando(null);
  }

  // ---- Notas ----
  function agregarNota(texto: string) {
    const nueva: Nota = { id: generarId(), texto, creadaEn: Date.now() };
    setEstado((s) => ({ ...s, notas: [...s.notas, nueva] }));
  }
  function eliminarNota(id: string) {
    setEstado((s) => ({ ...s, notas: s.notas.filter((n) => n.id !== id) }));
    setConfirmando(null);
  }

  // ---- Backup / reset ----
  function restablecerSemana() {
    // Se limpian las tareas puntuales de la semana; hábitos y notas se conservan.
    setEstado((s) => ({ ...s, tareas: [] }));
    setConfirmando(null);
  }

  return (
    <div className="min-h-screen bg-fondo px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <Header
          busqueda={busqueda}
          onBusqueda={setBusqueda}
          tema={tema}
          onSeleccionarTema={setTema}
          vista={vista}
          onCambiarVista={setVista}
          onRestablecer={() => setConfirmando({ tipo: 'reset' })}
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className={`mb-6 gap-3 pb-2 ${
            vista === 'horizontal'
              ? 'flex overflow-x-auto md:grid md:grid-cols-7 md:overflow-visible'
              : 'flex flex-col md:grid md:grid-cols-1'
          }`}>
            {DIAS.map((d) => (
              <DayColumn
                key={d.key}
                diaKey={d.key}
                vista={vista}
                etiqueta={d.corto}
                esHoy={d.key === hoy}
                tareas={tareasPorDia(d.key)}
                categorias={estado.categorias}
                onAgregar={() => setModalTarea({ tarea: null, dia: d.key })}
                onToggle={toggleTarea}
                onEditar={(t) => setModalTarea({ tarea: t, dia: t.dia })}
                onEliminar={(t) => setConfirmando({ tipo: 'eliminar-tarea', tarea: t })}
                onDuplicar={duplicarTarea}
              />
            ))}
          </div>

          <DragOverlay>
            {tareaArrastrando && (
              <TaskCard
                tarea={tareaArrastrando}
                categoria={estado.categorias.find((c) => c.id === tareaArrastrando.categoriaId) ?? null}
                onToggle={() => {}}
                onEditar={() => {}}
                onEliminar={() => {}}
                onDuplicar={() => {}}
              />
            )}
          </DragOverlay>
        </DndContext>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Habitos
            habitos={estado.habitos}
            onAgregar={agregarHabito}
            onToggleDia={toggleHabitoDia}
            onEliminar={(id) => {
              const habito = estado.habitos.find((h) => h.id === id);
              if (habito) setConfirmando({ tipo: 'eliminar-habito', habito });
            }}
          />
          <Notas
            notas={estado.notas}
            onAgregar={agregarNota}
            onEliminar={(id) => {
              const nota = estado.notas.find((n) => n.id === id);
              if (nota) setConfirmando({ tipo: 'eliminar-nota', nota });
            }}
          />
        </div>
      </div>

      {modalTarea && (
        <TaskModal
          tarea={modalTarea.tarea}
          diaInicial={modalTarea.dia}
          categorias={estado.categorias}
          onGuardar={(datos) =>
            modalTarea.tarea ? editarTarea(modalTarea.tarea.id, datos) : agregarTarea(datos)
          }
          onCerrar={() => setModalTarea(null)}
        />
      )}

      {confirmando?.tipo === 'reset' && (
        <ConfirmModal
          titulo="¿Restablecer la semana?"
          mensaje="Se borrarán todas las tareas de esta semana. Los hábitos y las notas se conservan. Esta acción no se puede deshacer."
          textoConfirmar="Sí, borrar todo"
          onConfirmar={restablecerSemana}
          onCancelar={() => setConfirmando(null)}
        />
      )}

      {confirmando?.tipo === 'eliminar-tarea' && (
        <ConfirmModal
          titulo="¿Eliminar esta tarea?"
          mensaje={`"${confirmando.tarea.texto}" se eliminará permanentemente.`}
          textoConfirmar="Eliminar"
          onConfirmar={() => eliminarTarea(confirmando.tarea.id)}
          onCancelar={() => setConfirmando(null)}
        />
      )}

      {confirmando?.tipo === 'eliminar-habito' && (
        <ConfirmModal
          titulo="¿Eliminar este hábito?"
          mensaje={`"${confirmando.habito.texto}" se eliminará de la lista de hábitos.`}
          textoConfirmar="Eliminar"
          onConfirmar={() => eliminarHabito(confirmando.habito.id)}
          onCancelar={() => setConfirmando(null)}
        />
      )}

      {confirmando?.tipo === 'eliminar-nota' && (
        <ConfirmModal
          titulo="¿Eliminar esta nota?"
          mensaje={`"${confirmando.nota.texto}" se eliminará permanentemente.`}
          textoConfirmar="Eliminar"
          onConfirmar={() => eliminarNota(confirmando.nota.id)}
          onCancelar={() => setConfirmando(null)}
        />
      )}
    </div>
  );
}
