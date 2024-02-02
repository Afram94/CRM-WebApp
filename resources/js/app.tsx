// First, import necessary packages
import './bootstrap';
import '../css/app.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import { PermissionsProvider } from '../providers/permissionsContext';
import { EchoProvider } from '../providers/WebSocketContext';
import { WidthProvider } from '../providers/WidthContext';
import { ButtonColorProvider } from '../providers/ButtonColorContext';


declare global {
  interface Window {
    Echo: any;
    Pusher: any;
  }
}




const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
          <EchoProvider>
            <PermissionsProvider>
              <WidthProvider>
                <ButtonColorProvider>
                  <App {...props} />
                </ButtonColorProvider>
              </WidthProvider>
            </PermissionsProvider>
          </EchoProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
