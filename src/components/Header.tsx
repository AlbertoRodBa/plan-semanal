import { Columns3, Moon, RotateCcw, Rows3, Search, Snowflake, Sun } from 'lucide-react';
import { useState } from 'react';

function IconoFantasma({ size = 16 }: { size?: number }) {
  return <i className="fa-solid fa-ghost" style={{ fontSize: size }} aria-hidden="true" />;
}

type Props = {
  busqueda: string;
  onBusqueda: (v: string) => void;
  tema: 'claro' | 'oscuro' | 'fantasma' | 'hielo';
  onSeleccionarTema: (tema: 'claro' | 'oscuro' | 'fantasma' | 'hielo') => void;
  vista: 'horizontal' | 'vertical';
  onCambiarVista: (vista: 'horizontal' | 'vertical') => void;
  onRestablecer: () => void;
};

export function Header({
  busqueda,
  onBusqueda,
  tema,
  onSeleccionarTema,
  vista,
  onCambiarVista,
  onRestablecer,
}: Props) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const opcionesTema = [
    { valor: 'claro', label: 'Claro', icon: Sun },
    { valor: 'oscuro', label: 'Oscuro', icon: Moon },
    { valor: 'fantasma', label: 'Fantasma', icon: IconoFantasma },
    { valor: 'hielo', label: 'Hielo', icon: Snowflake },
  ] as const;

  const IconoTemaActual = opcionesTema.find((opcion) => opcion.valor === tema)?.icon ?? Sun;

  return (
    <header className="mb-6 rounded-2xl border border-borde bg-superficie/90 p-4 shadow-[0_1px_2px_rgba(20,23,18,0.04),0_8px_22px_rgba(20,23,18,0.04)] backdrop-blur-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-musgo-500 text-white shadow-sm shadow-musgo-500/30">
            <i className="fa-solid fa-book text-sm" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-tinta">Plan semanal</h1>
            <p className="text-sm text-tinta-suave">Tu semana, visualizada y ordenada.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-suave" />
            <input
              value={busqueda}
              onChange={(e) => onBusqueda(e.target.value)}
              placeholder="Buscar tareas..."
              className="w-40 rounded-lg border border-borde bg-fondo py-1.5 pl-8 pr-3 text-xs text-tinta outline-none transition focus:w-52 focus:border-musgo-400 sm:w-44"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuAbierto((valor) => !valor)}
              className="rounded-lg border border-borde bg-fondo p-2 text-tinta-suave transition hover:border-musgo-300 hover:text-musgo-600"
              aria-label="Cambiar tema"
              title={`Tema actual: ${tema}`}
            >
              <IconoTemaActual size={16} />
            </button>

            {menuAbierto && (
              <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-borde bg-superficie p-1.5 shadow-[0_8px_22px_rgba(20,23,18,0.08)]">
                {opcionesTema.map(({ valor, label, icon: Icono }) => (
                  <button
                    key={valor}
                    onClick={() => {
                      onSeleccionarTema(valor);
                      setMenuAbierto(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                      tema === valor
                        ? 'bg-musgo-50 text-musgo-700 ring-1 ring-inset ring-musgo-200'
                        : 'text-tinta hover:bg-fondo'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-fondo text-tinta-suave">
                        <Icono size={14} />
                      </span>
                      {label}
                    </span>
                    {tema === valor && <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">Act</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onCambiarVista(vista === 'horizontal' ? 'vertical' : 'horizontal')}
            className="flex items-center gap-1.5 rounded-lg border border-borde bg-fondo px-3 py-2 text-xs font-medium text-tinta-suave transition hover:border-musgo-200 hover:bg-musgo-50 hover:text-musgo-600"
            title={vista === 'horizontal' ? 'Cambiar a vista vertical' : 'Cambiar a vista horizontal'}
          >
            {vista === 'horizontal' ? <Rows3 size={14} /> : <Columns3 size={14} />}
            {vista === 'horizontal' ? 'Vertical' : 'Horizontal'}
          </button>

          <button
            onClick={onRestablecer}
            className="flex items-center gap-1.5 rounded-lg border border-borde bg-fondo px-3 py-2 text-xs font-medium text-tinta-suave transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <RotateCcw size={14} /> Restablecer semana
          </button>
        </div>
      </div>
    </header>
  );
}
