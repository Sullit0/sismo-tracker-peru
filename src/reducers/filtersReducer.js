// Paso 4 / refuerzo de Paso 5: useReducer para concentrar la lógica de filtros.
// Evita múltiples useState que disparan re-renders descoordinados.

export const initialFilters = {
  days: 30,
  minMag: 4.0,
  maxDepth: 700,
  query: '',
  ordenarPor: 'time', // 'time' | 'mag' | 'depth'
};

export function filtersReducer(state, action) {
  switch (action.type) {
    case 'setDays':
      return { ...state, days: action.payload };
    case 'setMinMag':
      return { ...state, minMag: action.payload };
    case 'setMaxDepth':
      return { ...state, maxDepth: action.payload };
    case 'setQuery':
      return { ...state, query: action.payload };
    case 'setOrden':
      return { ...state, ordenarPor: action.payload };
    case 'reset':
      return initialFilters;
    default:
      throw new Error(`Acción desconocida: ${action.type}`);
  }
}
