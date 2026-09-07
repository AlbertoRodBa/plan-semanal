export type DiaSemana = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';

export const DIAS: { key: DiaSemana; label: string; corto: string }[] = [
  { key: 'lun', label: 'Lunes', corto: 'Lun' },
  { key: 'mar', label: 'Martes', corto: 'Mar' },
  { key: 'mie', label: 'Miércoles', corto: 'Mié' },
  { key: 'jue', label: 'Jueves', corto: 'Jue' },
  { key: 'vie', label: 'Viernes', corto: 'Vie' },
  { key: 'sab', label: 'Sábado', corto: 'Sáb' },
  { key: 'dom', label: 'Domingo', corto: 'Dom' },
];

export type Categoria = {
  id: string;
  nombre: string;
  color: string; // token de color, ej "musgo-400"
};

export type Prioridad = 1 | 2 | 3;

export type Tarea = {
  id: string;
  texto: string;
  dia: DiaSemana;
  categoriaId: string | null;
  prioridad: Prioridad;
  completada: boolean;
  orden: number;
  creadaEn: number;
};

export type Habito = {
  id: string;
  texto: string;
  completadoDias: Partial<Record<DiaSemana, boolean>>;
};

export type Nota = {
  id: string;
  texto: string;
  creadaEn: number;
};

export type EstadoApp = {
  tareas: Tarea[];
  categorias: Categoria[];
  habitos: Habito[];
  notas: Nota[];
};
