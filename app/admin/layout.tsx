import { AppProvider } from "@/domains/admin/context/AppContext";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppProvider>{children}</AppProvider>;
}
