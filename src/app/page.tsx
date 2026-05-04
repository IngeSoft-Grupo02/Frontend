import { redirect } from 'next/navigation';

export default function Home() {
  // Redirige automáticamente a /admin
  redirect('/admin');
}