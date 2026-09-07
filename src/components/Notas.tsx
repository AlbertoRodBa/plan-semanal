import { useState } from 'react';
import { ChevronDown, ChevronUp, NotebookPen, Plus, Trash2 } from 'lucide-react';
import type { Nota } from '../types';

type Props = {
  notas: Nota[];
  onAgregar: (texto: string) => void;
  onEliminar: (id: string) => void;
};

export function Notas({ notas, onAgregar, onEliminar }: Props) {
  const [texto, setTexto] = useState('');
  const [minimizado, setMinimizado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;
    onAgregar(texto.trim());
    setTexto('');
  };

  return (
    <section
      className={`self-start rounded-2xl border border-borde bg-superficie shadow-sm ${minimizado ? 'p-2.5' : 'p-4'}`}
    >
      <div className={`flex items-center justify-between gap-2 ${minimizado ? '' : 'mb-3'}`}>
        <div className="flex items-center gap-2">
          <NotebookPen size={16} className="text-musgo-500" />
          <h2 className="font-display text-sm font-semibold text-tinta">Notas rápidas</h2>
        </div>
        <button
          type="button"
          onClick={() => setMinimizado((valor) => !valor)}
          className="rounded-md p-1 text-tinta-suave transition hover:bg-fondo hover:text-musgo-600"
          aria-expanded={!minimizado}
          aria-label={minimizado ? 'Expandir notas rápidas' : 'Minimizar notas rápidas'}
          title={minimizado ? 'Expandir' : 'Minimizar'}
        >
          {minimizado ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {!minimizado && (
        <form onSubmit={handleSubmit} className="mb-3 flex gap-2">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Algo que no quieres olvidar..."
            className="flex-1 rounded-lg border border-borde bg-fondo px-3 py-1.5 text-xs text-tinta outline-none focus:border-musgo-400"
          />
          <button
            type="submit"
            disabled={!texto.trim()}
            className="flex items-center gap-1 rounded-lg bg-musgo-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-musgo-600 disabled:opacity-40"
          >
            <Plus size={13} /> Agregar
          </button>
        </form>
      )}

      {!minimizado && (notas.length === 0 ? (
        <p className="text-xs leading-relaxed text-tinta-suave">
          Aquí puedes guardar ideas sueltas que no encajan en un día fijo.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {notas.map((n) => (
            <li
              key={n.id}
              className="group flex items-start justify-between gap-2 rounded-lg bg-fondo px-3 py-1.5 text-xs text-tinta"
            >
              <span className="break-words">{n.texto}</span>
              <button
                onClick={() => onEliminar(n.id)}
                className="shrink-0 rounded-md p-0.5 text-tinta-suave opacity-0 transition hover:text-red-700 group-hover:opacity-100"
                aria-label="Eliminar nota"
              >
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      ))}
    </section>
  );
}
