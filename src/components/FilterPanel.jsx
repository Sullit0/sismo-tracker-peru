import { memo, useEffect, useRef } from 'react';

// Paso 4: useRef para enfocar el input de búsqueda al montar
// sin disparar re-render (el ref es mutable, no estado).
function FilterPanel({ filters, dispatch, onReset, total, filtrados }) {
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  return (
    <aside className="filters">
      <h2>Filtros</h2>

      <label className="field">
        <span>Buscar lugar</span>
        <input
          ref={searchRef}
          type="search"
          placeholder="ej. Lima, Arequipa…"
          value={filters.query}
          onChange={(e) => dispatch({ type: 'setQuery', payload: e.target.value })}
        />
      </label>

      <label className="field">
        <span>Ventana de días: <b>{filters.days}</b></span>
        <div className="presets">
          {[1, 7, 30, 90].map((d) => (
            <button
              key={d}
              type="button"
              className={`chip ${filters.days === d ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'setDays', payload: d })}
            >
              {d === 1 ? '24h' : `${d}d`}
            </button>
          ))}
        </div>
        <input
          type="range"
          min="1"
          max="90"
          value={filters.days}
          onChange={(e) => dispatch({ type: 'setDays', payload: Number(e.target.value) })}
        />
      </label>

      <label className="field">
        <span>Magnitud mínima: <b>{filters.minMag.toFixed(1)}</b></span>
        <input
          type="range"
          min="2"
          max="7"
          step="0.1"
          value={filters.minMag}
          onChange={(e) => dispatch({ type: 'setMinMag', payload: Number(e.target.value) })}
        />
      </label>

      <label className="field">
        <span>Profundidad máxima (km): <b>{filters.maxDepth}</b></span>
        <input
          type="range"
          min="10"
          max="700"
          step="10"
          value={filters.maxDepth}
          onChange={(e) => dispatch({ type: 'setMaxDepth', payload: Number(e.target.value) })}
        />
      </label>

      <label className="field">
        <span>Ordenar por</span>
        <select
          value={filters.ordenarPor}
          onChange={(e) => dispatch({ type: 'setOrden', payload: e.target.value })}
        >
          <option value="time">Más reciente</option>
          <option value="mag">Mayor magnitud</option>
          <option value="depth">Menor profundidad</option>
        </select>
      </label>

      <button type="button" onClick={onReset} className="reset">
        ↺ Resetear filtros
      </button>

      <div className="counter">
        Mostrando <b>{filtrados}</b> de <b>{total}</b> sismos
      </div>
    </aside>
  );
}

// memo: este panel solo re-renderiza si cambia filters / total / filtrados.
// onReset es estable porque viene memoizado con useCallback desde App.
export default memo(FilterPanel);
