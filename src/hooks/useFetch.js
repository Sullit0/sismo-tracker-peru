import { useEffect, useReducer } from 'react';

// =============================================================================
// PASO 5 — Hook Personalizado: useFetch
// =============================================================================
// Encapsula la lógica de carga HTTP en un hook reutilizable. Estado expuesto:
// { data, error, loading }. Maneja:
//   • useReducer interno para no acumular múltiples useState descoordinados.
//   • AbortController para cancelar la request si el componente se desmonta o
//     si las dependencias cambian (cubre el PASO 2 del laboratorio).
//   • Compatible con React.StrictMode (PASO 1): el doble-invoke en dev se
//     absorbe descartando AbortError.
// Reglas de Hooks: useFetch llama useEffect/useReducer SOLO al nivel superior,
// nunca dentro de loops, condiciones ni funciones anidadas.
// =============================================================================

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

export function useFetch(url, { transform, refreshKey = 0 } = {}) {
  const [state, dispatch] = useReducer(fetchReducer, initial);

  // ---------------------------------------------------------------------------
  // PASO 2 — useEffect con async/await + AbortController
  // ---------------------------------------------------------------------------
  // El efecto refetchea cuando cambia la URL, la función transform o un
  // refreshKey externo. El cleanup aborta la request en vuelo: indispensable
  // porque en StrictMode el efecto se ejecuta 2× en dev (NO es "una sola vez"
  // aunque las deps no cambien) y porque evita memory leaks si el componente
  // se desmonta antes de que la respuesta llegue.
  // ---------------------------------------------------------------------------
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
  }, [url, transform, refreshKey]);

  return state;
}
