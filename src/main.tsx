import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { setupIonicReact } from '@ionic/react';

/* Importamos el CSS principal requerido por Ionic */
import '@ionic/react/css/core.css';

/* Estilos CSS básicos para componentes de Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Utilidades de CSS opcionales */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Variables del tema de la aplicación */
import './theme/variables.css';

import { defineCustomElements } from '@ionic/pwa-elements/loader';

setupIonicReact();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Cargamos los elementos personalizados de PWA antes del render
defineCustomElements(window);
