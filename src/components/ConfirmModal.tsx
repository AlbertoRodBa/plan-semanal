import { AlertTriangle } from 'lucide-react';
import { useEffect, useRef } from 'react';

type Props = {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  peligroso?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
};

export function ConfirmModal({
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  peligroso = true,
  onConfirmar,
  onCancelar,
}: Props) {
  const botonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    botonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancelar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancelar]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/30 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-titulo"
      onClick={onCancelar}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-superficie p-6 shadow-suave"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-musgo-100">
            <AlertTriangle size={18} className="text-musgo-600" />
          </span>
          <h2 id="confirm-titulo" className="font-display text-lg font-semibold text-tinta">
            {titulo}
          </h2>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-tinta-suave">{mensaje}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancelar}
            className="rounded-lg border border-borde px-4 py-2 text-sm font-medium text-tinta transition hover:bg-fondo"
          >
            Cancelar
          </button>
          <button
            ref={botonRef}
            onClick={onConfirmar}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
              peligroso ? 'bg-red-700 hover:bg-red-800' : 'boton-acento bg-musgo-500 hover:bg-musgo-600'
            }`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
