import { useCallback, useMemo, useReducer, useState } from 'react';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import SismoList from './components/SismoList';
import Stats from './components/Stats';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useFetch } from './hooks/useFetch';
import { useDebounce } from './hooks/useDebounce';
import { filtersReducer, initialFilters } from './reducers/filtersReducer';
import { buildUsgsUrl } from './utils/usgs';
import './App.css';

// Transformación pasada como referencia ESTABLE al hook useFetch.
// Si la declarara dentro del componente, cambiaría en cada render y
// rompería el array de dependencias de useEffect.
function transformUsgs(json) {
  return json.features.map((f) => ({
    id: f.id,
    mag: f.properties.mag ?? 0,
    place: f.properties.place,
    time: f.properties.time,
    depth: f.geometry.coordinates[2] ?? 0,
    url: f.properties.url,
  }));
}

function Dashboard() {
  const [filters, dispatch] = useReducer(filtersReducer, initialFilters);
  const [lastRefresh, setLastRefresh] = useState(() => Date.now());

  // useMemo: la URL solo cambia cuando varían los parámetros del servidor
  // (días / magnitud mínima) o el lastRefresh. Con esto evitamos que cada
  // tecla en "Buscar lugar" dispare un nuevo fetch — esa búsqueda se hace
  // sobre el cliente. lastRefresh entra como nonce (cache-buster real)
  // para que también sea una dependencia legítima del memo.
  const url = useMemo(
    () => buildUsgsUrl({ days: filters.days, minMag: filters.minMag, nonce: lastRefresh }),
    [filters.days, filters.minMag, lastRefresh]
  );
  // IA sugirió incluir [filters] entero como dep → Solución manual:
  // pasamos solo los campos que afectan la URL del servidor. Esto evita
  // un loop de refetch cada vez que el usuario tipea en el buscador.

  const { data: sismos, loading, error } = useFetch(url, { transform: transformUsgs });

  // Debounce del texto de búsqueda para no filtrar en cada keystroke.
  const queryDebounced = useDebounce(filters.query, 200);

  // Paso 4: filtro y orden pesados memoizados.
  const sismosFiltrados = useMemo(() => {
    if (!sismos) return [];
    const q = queryDebounced.trim().toLowerCase();
    const filtrados = sismos.filter((s) => {
      if (s.depth > filters.maxDepth) return false;
      if (q && !(s.place ?? '').toLowerCase().includes(q)) return false;
      return true;
    });
    const cmp = {
      time: (a, b) => b.time - a.time,
      mag: (a, b) => b.mag - a.mag,
      depth: (a, b) => a.depth - b.depth,
    }[filters.ordenarPor];
    return [...filtrados].sort(cmp);
  }, [sismos, queryDebounced, filters.maxDepth, filters.ordenarPor]);

  // useCallback: referencia estable para que <FilterPanel memo> no
  // re-renderice por un onReset nuevo en cada render del padre.
  const handleReset = useCallback(() => dispatch({ type: 'reset' }), []);

  const handleRefresh = useCallback(() => setLastRefresh(Date.now()), []);

  return (
    <div className="app">
      <Header />

      <main className="main">
        <FilterPanel
          filters={filters}
          dispatch={dispatch}
          onReset={handleReset}
          total={sismos?.length ?? 0}
          filtrados={sismosFiltrados.length}
        />

        <div className="content">
          <div className="toolbar">
            <h2>Eventos recientes</h2>
            <button onClick={handleRefresh} className="ghost">↻ Refrescar</button>
          </div>
          <Stats sismos={sismosFiltrados} />
          <SismoList sismos={sismosFiltrados} loading={loading} error={error} />
        </div>
      </main>

      <footer className="footer">
        <small>
          Fuente: <a href="https://earthquake.usgs.gov/" target="_blank" rel="noreferrer">USGS Earthquake Hazards Program</a>
          {' · '}Bounding box: territorio peruano + dominio marítimo
        </small>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </ThemeProvider>
  );
}
