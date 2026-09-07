import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { Categoria, DiaSemana, Prioridad, Tarea } from '../types';
import { DIAS } from '../types';
import { Estrellas } from './Estrellas';

type Props = {
  tarea?: Tarea | null;
  diaInicial: DiaSemana;
  categorias: Categoria[];
  onGuardar: (datos: {
    texto: string;
    dia: DiaSemana;
    categoriaId: string | null;
    prioridad: Prioridad;
  }) => void;
  onCerrar: () => void;
};

export function TaskModal({ tarea, diaInicial, categorias, onGuardar, onCerrar }: Props) {
  const [texto, setTexto] = useState(tarea?.texto ?? '');
  const [dia, setDia] = useState<DiaSemana>(tarea?.dia ?? diaInicial);
  const [categoriaId, setCategoriaId] = useState<string | null>(tarea?.categoriaId ?? null);
  const [prioridad, setPrioridad] = useState<Prioridad>(tarea?.prioridad ?? 1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCerrar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;
    onGuardar({ texto: texto.trim(), dia, categoriaId, prioridad });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/30 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onCerrar}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-superficie p-6 shadow-suave"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-tinta">
            {tarea ? 'Editar tarea' : 'Nueva tarea'}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-full p-1 text-tinta-suave transition hover:bg-fondo"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <label className="mb-1 block text-xs font-medium text-tinta-suave">¿Qué hay que hacer?</label>
        <input
          ref={inputRef}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ej: Llamar al dentista"
          className="mb-4 w-full rounded-lg border border-borde bg-fondo px-3 py-2 text-sm text-tinta outline-none focus:border-musgo-400"
        />

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-tinta-suave">Día</label>
            <select
              value={dia}
              onChange={(e) => setDia(e.target.value as DiaSemana)}
              className="w-full rounded-lg border border-borde bg-fondo px-3 py-2 text-sm text-tinta outline-none focus:border-musgo-400"
            >
              {DIAS.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-tinta-suave">Categoría</label>
            <select
              value={categoriaId ?? ''}
              onChange={(e) => setCategoriaId(e.target.value || null)}
              className="w-full rounded-lg border border-borde bg-fondo px-3 py-2 text-sm text-tinta outline-none focus:border-musgo-400"
            >
              <option value="">Sin categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-xs font-medium text-tinta-suave">Prioridad</label>
          <Estrellas valor={prioridad} onChange={setPrioridad} tamano={22} />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-lg border border-borde px-4 py-2 text-sm font-medium text-tinta transition hover:bg-fondo"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!texto.trim()}
            className="rounded-lg bg-musgo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-musgo-600 disabled:opacity-40"
          >
            {tarea ? 'Guardar cambios' : 'Agregar tarea'}
          </button>
        </div>
      </form>
    </div>
  );
}
