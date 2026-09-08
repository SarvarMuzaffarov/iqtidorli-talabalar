import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { EyeCareProvider } from './context/EyeCareContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EyeCareProvider>
      <App />
    </EyeCareProvider>
  </StrictMode>,
);
