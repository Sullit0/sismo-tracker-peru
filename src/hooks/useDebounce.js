import { useEffect, useState } from 'react';

// Hook personalizado complementario.
// Difiere el valor durante `delay` ms para evitar filtrar en cada tecla.
export function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
