import { AppProvider } from "@/domains/cliente/context/AppContext";

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppProvider>{children}</AppProvider>;
}
