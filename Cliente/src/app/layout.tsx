import '../globals.css';
import type { Metadata } from 'next';
import { AppProvider } from '../context/AppContext';

export const metadata: Metadata = {
  title: 'Kingstore Cliente',
  description: 'Prototipo web desktop de alta fidelidad para el módulo cliente del sistema Kingstore, con flujos de cotización, catálogo y gestión de pedidos.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
