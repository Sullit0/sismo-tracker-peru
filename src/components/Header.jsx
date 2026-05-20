import { memo, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

function Header() {
  const { theme, toggle } = useTheme();
  const { user, login, logout } = useAuth();
  // useRef: referencia mutable que NO dispara re-render al actualizarse.
  const inputRef = useRef(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const nombre = inputRef.current?.value.trim();
    if (nombre) {
      login(nombre);
      inputRef.current.value = '';
    }
  };

  return (
    <header className="app-header">
      <div className="brand">
        <span className="logo" aria-hidden>🌎</span>
        <div>
          <h1>SismoTracker Perú</h1>
          <p className="tagline">
            Monitor de eventos sísmicos en territorio peruano — datos USGS
          </p>
        </div>
      </div>

      <div className="header-actions">
        {user ? (
          <div className="auth-pill">
            <span>👤 {user.nombre}</span>
            <small>{user.rol}</small>
            <button onClick={logout} className="ghost">Salir</button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="auth-form">
            <input
              ref={inputRef}
              type="text"
              placeholder="Tu nombre, observador…"
              aria-label="Nombre del observador"
            />
            <button type="submit">Ingresar</button>
          </form>
        )}

        <button
          type="button"
          className="theme-toggle"
          onClick={toggle}
          aria-label={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

export default memo(Header);
