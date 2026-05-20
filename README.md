# SismoTracker Perú

> Monitor SPA de sismos en territorio peruano construido con **Vite + React 19**.
> Datos en tiempo casi-real desde el [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/).
>
> **Curso:** IS093A — Desarrollo de Aplicaciones Web · Semana 07
> **Tema:** React Hooks — `useState`, `useEffect`, `useContext`, `useRef`, `useReducer`, `useCallback`, `useMemo` y Hooks Personalizados.
> **Universidad:** Universidad Nacional del Centro del Perú · FIS

---

## ¿Qué hace?

Consulta la API pública de USGS por **eventos sísmicos dentro de un bounding box que cubre Perú continental + dominio marítimo**, los muestra en tarjetas con código de color por magnitud, y permite:

- Filtrar por **ventana de días** (1–90) y **magnitud mínima** (afecta la query al servidor).
- Filtrar por **profundidad máxima** y **texto libre del lugar** (en el cliente).
- Ordenar por fecha / magnitud / profundidad.
- Calcular en vivo: total, mag. promedio, mag. máxima, epicentro más fuerte, profundidad promedio.
- Cambiar **tema** (oscuro/claro) y simular **sesión de observador IGP**.

## Stack

- Vite 8 · React 19 (StrictMode)
- ESLint con `eslint-plugin-react-hooks` (sin reglas desactivadas)
- API pública: `https://earthquake.usgs.gov/fdsnws/event/1/query`

---

## Mapeo de los 5 pasos del PDF al código

| Paso | Tema PDF | Archivo(s) | Detalle |
|------|----------|------------|---------|
| **1** | `React.StrictMode` + ciclo de render | `src/main.jsx` | Toda la app va dentro de `<StrictMode>`. Los efectos se ejecutan dos veces en dev y el `useFetch` lo absorbe con `AbortController`. |
| **2** | `useEffect` async/await + `AbortController` | `src/hooks/useFetch.js` | Función async dentro del efecto, signal del controller en `fetch`, cleanup que aborta. `[ ]` ≠ "una vez" en StrictMode, por eso el cleanup. |
| **3** | `useContext` por dominio | `src/context/ThemeContext.jsx`, `src/context/AuthContext.jsx`, `src/hooks/useTheme.js`, `src/hooks/useAuth.js` | Dos contextos separados (Theme y Auth). El contexto vive en `*.js` aparte del Provider para no romper Fast Refresh. |
| **4** | `useMemo` / `useCallback` / `useRef` (+ `useReducer`) | `src/App.jsx`, `src/components/FilterPanel.jsx`, `src/components/Stats.jsx`, `src/reducers/filtersReducer.js` | URL memoizada, filtros y orden memoizados, agregados memoizados, `handleReset`/`handleRefresh` estables con `useCallback`, `useRef` para auto-focus del buscador y captura de input de login sin re-render. |
| **5** | Hook personalizado | `src/hooks/useFetch.js`, `src/hooks/useDebounce.js`, `src/hooks/useTheme.js`, `src/hooks/useAuth.js` | `useFetch` reutiliza la lógica de carga + abort + estado (loading/error/data) con `useReducer`. Reutilizado por toda la app. |

> Restricción del laboratorio cumplida: cada intervención de IA está marcada como
> `// IA: [problema] → Solución manual: [explicación]` (ver `App.jsx` y `useFetch.js`).

---

## Cómo correr

```bash
npm install
npm run dev          # http://localhost:5173
npm run lint         # debe pasar con 0 errores y 0 warnings
npm run build
npm run preview
```

## Estructura

```
src/
├── main.jsx                     # StrictMode + montaje
├── App.jsx                      # Composición + useReducer + useMemo + useCallback
├── App.css
├── index.css
├── context/
│   ├── theme-context.js         # createContext aislado (Fast Refresh-safe)
│   ├── auth-context.js
│   ├── ThemeContext.jsx         # <ThemeProvider>
│   └── AuthContext.jsx          # <AuthProvider>
├── hooks/
│   ├── useFetch.js              # hook personalizado principal
│   ├── useDebounce.js           # hook personalizado complementario
│   ├── useTheme.js              # consumo de ThemeContext
│   └── useAuth.js               # consumo de AuthContext
├── components/
│   ├── Header.jsx               # useRef para input de login
│   ├── FilterPanel.jsx          # useRef para auto-focus + memo
│   ├── SismoList.jsx
│   ├── SismoCard.jsx            # memo
│   └── Stats.jsx                # useMemo para agregados
├── reducers/
│   └── filtersReducer.js        # useReducer state machine
└── utils/
    └── usgs.js                  # builder de URL + bounding box Perú
```

## Validación con React DevTools Profiler

1. Abrir DevTools → pestaña **Profiler**.
2. Click "Record", luego mover el slider de "Magnitud mínima". Detenerlo.
3. Verificar que **solo `FilterPanel`, `Stats` y `SismoList` se vuelven a renderizar**, no `Header` (gracias a `memo` + `useCallback` estables).
4. Repetir cambiando el tema: solo `Header` debería re-renderizar.

## Licencia

Uso académico (UNCP — FIS — IS093A).
