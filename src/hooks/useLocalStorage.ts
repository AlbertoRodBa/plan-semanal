import { useEffect, useState } from 'react';

export function useLocalStorage<T>(clave: string, valorInicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const guardado = window.localStorage.getItem(clave);
      return guardado ? (JSON.parse(guardado) as T) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // localStorage lleno o no disponible: se ignora silenciosamente
    }
  }, [clave, valor]);

  return [valor, setValor] as const;
}
