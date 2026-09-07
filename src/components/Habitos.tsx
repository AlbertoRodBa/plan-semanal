import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Repeat, Trash2 } from 'lucide-react';
import { DIAS } from '../types';
import type { Habito } from '../types';

type Props = {
  habitos: Habito[];
  onAgregar: (texto: string) => void;
  onToggleDia: (id: string, dia: (typeof DIAS)[number]['key']) => void;
  onEliminar: (id: string) => void;
};

export function Habitos({ habitos, onAgregar, onToggleDia, onEliminar }: Props) {
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
          <Repeat size={16} className="text-musgo-500" />
          <h2 className="font-display text-sm font-semibold text-tinta">Hábitos de la semana</h2>
        </div>
        <button
          type="button"
          onClick={() => setMinimizado((valor) => !valor)}
          className="rounded-md p-1 text-tinta-suave transition hover:bg-fondo hover:text-musgo-600"
          aria-expanded={!minimizado}
          aria-label={minimizado ? 'Expandir hábitos de la semana' : 'Minimizar hábitos de la semana'}
          title={minimizado ? 'Expandir' : 'Minimizar'}
        >
          {minimizado ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {!minimizado && (habitos.length === 0 ? (
        <p className="mb-3 text-xs leading-relaxed text-tinta-suave">
          Aún no tienes hábitos recurrentes. Agrega algo que quieras hacer todos los días, como
          "tomar agua" o "estirar".
        </p>
      ) : (
        <div className="mb-3 overflow-x-auto scrollbar-fina">
          <table className="w-full min-w-[420px] border-collapse text-xs">
            <thead>
              <tr>
                <th className="pb-2 text-left font-medium text-tinta-suave">Hábito</th>
                {DIAS.map((d) => (
                  <th key={d.key} className="pb-2 text-center font-medium text-tinta-suave">
                    {d.corto}
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {habitos.map((h) => (
                <tr key={h.id} className="border-t border-borde">
                  <td className="py-2 pr-2 text-tinta">{h.texto}</td>
                  {DIAS.map((d) => (
                    <td key={d.key} className="text-center">
                      <input
                        type="checkbox"
                        checked={!!h.completadoDias[d.key]}
                        onChange={() => onToggleDia(h.id, d.key)}
                        className="h-3.5 w-3.5 accent-musgo-500"
                        aria-label={`${h.texto} - ${d.label}`}
                      />
                    </td>
                  ))}
                  <td>
                    <button
                      onClick={() => onEliminar(h.id)}
                      className="rounded-md p-1 text-tinta-suave transition hover:bg-red-50 hover:text-red-700"
                      aria-label={`Eliminar hábito ${h.texto}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {!minimizado && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Nuevo hábito, ej: tomar agua"
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
    </section>
  );
}
