import { useCallback, useState } from 'react';
import { AuthContext } from './auth-context';

// =============================================================================
// PASO 3 — useContext por dominio (parte 2/2: AuthContext)
// =============================================================================
// AuthProvider separado del ThemeProvider. Modela la sesión simulada de un
// observador del IGP (Instituto Geofísico del Perú). Si en el futuro se
// agregan más datos de sesión, solo este contexto re-renderiza a los
// consumidores que usan useAuth(), no a los que usan useTheme().
// =============================================================================
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
