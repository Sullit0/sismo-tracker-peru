import { useCallback, useState } from 'react';
import { AuthContext } from './auth-context';

// Paso 3: AuthProvider separado del ThemeProvider para evitar contextos gigantes.
// Sesión simulada de un observador del IGP (Instituto Geofísico del Perú).
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((nombre) => {
    setUser({ nombre, rol: 'Observador IGP', desde: Date.now() });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
