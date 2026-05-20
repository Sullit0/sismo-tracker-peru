import { useCallback, useEffect, useState } from 'react';
import { ThemeContext } from './theme-context';

// =============================================================================
// PASO 3 — useContext por dominio (parte 1/2: ThemeContext)
// =============================================================================
// ThemeProvider aislado del AuthProvider para evitar "contextos gigantes" que
// fuerzan re-renders innecesarios. Un Provider por dominio:
//   • ThemeContext → preferencia visual (tema oscuro/claro).
//   • AuthContext  → estado de sesión del observador (AuthContext.jsx).
// La constante del contexto vive en theme-context.js para no romper React
// Fast Refresh (un archivo .jsx solo exporta componentes).
// =============================================================================
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('sismo:theme');
    return stored === 'light' || stored === 'dark' ? stored : 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('sismo:theme', theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
