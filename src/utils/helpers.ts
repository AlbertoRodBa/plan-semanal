import type { EstadoApp } from '../types';

export function generarId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function descargarJSON(estado: EstadoApp) {
  const blob = new Blob([JSON.stringify(estado, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const fecha = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `plan-semanal-backup-${fecha}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function leerArchivoJSON(archivo: File): Promise<EstadoApp> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => {
      try {
        const datos = JSON.parse(lector.result as string);
        if (!Array.isArray(datos.tareas) || !Array.isArray(datos.categorias)) {
          throw new Error('Formato inválido');
        }
        resolve(datos as EstadoApp);
      } catch (e) {
        reject(e);
      }
    };
    lector.onerror = () => reject(new Error('No se pudo leer el archivo'));
    lector.readAsText(archivo);
  });
}
