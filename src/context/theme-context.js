import { createContext } from 'react';

// Constante de contexto aislada del componente Provider para que
// react-refresh pueda regenerar el árbol sin perder estado en HMR.
export const ThemeContext = createContext(null);
