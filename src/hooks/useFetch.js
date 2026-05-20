import { useEffect, useReducer } from 'react';

// Hook personalizado (Paso 5).
// Encapsula: estado de carga, error, datos, AbortController para limpiar.
// Reglas de Hooks: este hook solo invoca useEffect/useReducer al nivel superior.

const initial = { data: null, error: null, loading: true };

function fetchReducer(state, action) {
  switch (action.type) {
    case 'start':
      return { data: null, error: null, loading: true };
    case 'success':
      return { data: action.payload, error: null, loading: false };
    case 'error':
      return { data: null, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function useFetch(url, { transform } = {}) {
  const [state, dispatch] = useReducer(fetchReducer, initial);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();

    dispatch({ type: 'start' });

    (async () => {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status} consultando USGS`);
        const json = await res.json();
        const data = transform ? transform(json) : json;
        dispatch({ type: 'success', payload: data });
      } catch (err) {
        // AbortError ocurre cuando StrictMode dobla el efecto en dev.
        // Es esperado: lo ignoramos para no contaminar el estado.
        if (err.name === 'AbortError') return;
        dispatch({ type: 'error', payload: err.message });
      }
    })();

    return () => controller.abort();
    // IA: useEffect con [url] disparaba 2x en StrictMode → Solución manual:
    // usamos AbortController para cancelar la primera request, la segunda
    // resuelve y actualiza el estado sin race condition.
  }, [url, transform]);

  return state;
}
