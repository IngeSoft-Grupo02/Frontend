import { AppProvider } from '@/domains/cliente/context/AppContext';

export default function StoreSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppProvider>{children}</AppProvider>;
}
