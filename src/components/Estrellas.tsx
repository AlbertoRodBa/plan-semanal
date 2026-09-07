import { Star } from 'lucide-react';
import type { Prioridad } from '../types';

type Props = {
  valor: Prioridad;
  onChange?: (v: Prioridad) => void;
  tamano?: number;
};

export function Estrellas({ valor, onChange, tamano = 14 }: Props) {
  const interactivo = !!onChange;
  return (
    <div className="flex items-center gap-0.5" role={interactivo ? 'radiogroup' : undefined} aria-label="Prioridad">
      {([1, 2, 3] as Prioridad[]).map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactivo}
          aria-label={`Prioridad ${n} de 3`}
          aria-checked={valor === n}
          onClick={() => onChange?.(n)}
          className={interactivo ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            size={tamano}
            className={n <= valor ? 'fill-musgo-500 text-musgo-500' : 'fill-transparent text-borde'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}
