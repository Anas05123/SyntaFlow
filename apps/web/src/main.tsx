import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { PageTransitions } from './components/marketing/PageTransitions';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <PageTransitions><App /></PageTransitions>
    </React.StrictMode>
  );
}
