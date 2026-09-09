import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Copy, GripVertical, Pencil, Trash2 } from 'lucide-react';
import type { Categoria, Tarea } from '../types';
import { Estrellas } from './Estrellas';

type Props = {
  tarea: Tarea;
  categoria: Categoria | null;
  onToggle: () => void;
  onEditar: () => void;
  onEliminar: () => void;
  onDuplicar: () => void;
};

export function TaskCard({ tarea, categoria, onToggle, onEditar, onEliminar, onDuplicar }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tarea.id,
    data: { tipo: 'tarea', dia: tarea.dia },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group rounded-xl border border-borde bg-tarea p-3 shadow-sm transition hover:shadow-suave"
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab touch-none text-borde transition hover:text-musgo-400 active:cursor-grabbing"
          aria-label="Arrastrar tarea"
        >
          <GripVertical size={16} />
        </button>

        <input
          type="checkbox"
          checked={tarea.completada}
          onChange={onToggle}
          className="mt-1 h-4 w-4 shrink-0 accent-[#88E788]"
          aria-label={tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
        />

        <div className="min-w-0 flex-1">
          <p
            className={`break-words text-sm transition ${
              tarea.completada ? 'text-tinta-suave line-through' : 'text-tinta'
            }`}
          >
            {tarea.texto}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <Estrellas valor={tarea.prioridad} />
            {categoria && (
              <span
                className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                style={{ backgroundColor: 'var(--color-musgo-100)', color: 'var(--color-musgo-700)' }}
              >
                {categoria.nombre}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none mt-2 flex justify-end gap-1 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
        <button
          onClick={onDuplicar}
          className="rounded-md p-1.5 text-tinta-suave transition hover:bg-fondo hover:text-musgo-600"
          aria-label="Duplicar tarea"
          title="Duplicar"
        >
          <Copy size={14} />
        </button>
        <button
          onClick={onEditar}
          className="rounded-md p-1.5 text-tinta-suave transition hover:bg-fondo hover:text-musgo-600"
          aria-label="Editar tarea"
          title="Editar"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onEliminar}
          className="rounded-md p-1.5 text-tinta-suave transition hover:bg-red-50 hover:text-red-700"
          aria-label="Eliminar tarea"
          title="Eliminar"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
