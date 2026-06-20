import { StoreProvider } from "@/domains/comerciante/context/StoreContext";

export default function ComercianteRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StoreProvider>{children}</StoreProvider>;
}
