import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import type { Categoria, DiaSemana, Tarea } from '../types';
import { TaskCard } from './TaskCard';

type Props = {
  diaKey: DiaSemana;
  etiqueta: string;
  esHoy: boolean;
  tareas: Tarea[];
  categorias: Categoria[];
  onAgregar: () => void;
  onToggle: (id: string) => void;
  onEditar: (t: Tarea) => void;
  onEliminar: (t: Tarea) => void;
  onDuplicar: (t: Tarea) => void;
};

export function DayColumn({
  diaKey,
  etiqueta,
  esHoy,
  tareas,
  categorias,
  onAgregar,
  onToggle,
  onEditar,
  onEliminar,
  onDuplicar,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: diaKey, data: { tipo: 'dia', dia: diaKey } });
  const categoriaPorId = (id: string | null) => (id ? categorias.find((c) => c.id === id) ?? null : null);

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-2xl border border-borde bg-fondo/60 p-3 md:w-full">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className={`font-display text-sm font-semibold ${esHoy ? 'text-musgo-600' : 'text-tinta'}`}>
            {etiqueta}
          </h3>
          {esHoy && <span className="h-1.5 w-1.5 rounded-full bg-musgo-500" aria-hidden />}
        </div>
        {tareas.length > 0 && <span className="text-xs text-tinta-suave">({tareas.length})</span>}
      </div>

      <div
        ref={setNodeRef}
        className={`flex min-h-[80px] flex-1 flex-col gap-2 rounded-xl p-1 transition scrollbar-fina ${
          isOver ? 'bg-musgo-50 ring-2 ring-musgo-200' : ''
        }`}
      >
        <SortableContext items={tareas.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tareas.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs leading-relaxed text-tinta-suave/70">
              Nada por aquí. Arrastra una tarea o crea la primera.
            </p>
          ) : (
            tareas.map((t) => (
              <TaskCard
                key={t.id}
                tarea={t}
                categoria={categoriaPorId(t.categoriaId)}
                onToggle={() => onToggle(t.id)}
                onEditar={() => onEditar(t)}
                onEliminar={() => onEliminar(t)}
                onDuplicar={() => onDuplicar(t)}
              />
            ))
          )}
        </SortableContext>
      </div>

      <button
        onClick={onAgregar}
        className="mt-2 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-borde py-2 text-xs font-medium text-tinta-suave transition hover:border-musgo-300 hover:bg-musgo-50 hover:text-musgo-600"
      >
        <Plus size={14} /> Agregar
      </button>
    </div>
  );
}
