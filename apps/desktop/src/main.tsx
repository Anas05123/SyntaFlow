import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/overlays.css';
import './styles/features.css';
import './styles/auth.css';
import './styles/appearance.css';
import './styles/guest-preview.css';
import './styles/startup.css';
import './styles/settings.css';

import App from './App';
import { StoreProvider } from './state/store';
import { AppearanceProvider } from './ui/useAppearance';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <StoreProvider>
      <AppearanceProvider>
        <App />
      </AppearanceProvider>
    </StoreProvider>
  </StrictMode>
);
