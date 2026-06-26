import { ClienteRouteView } from '@/domains/cliente/RouteView';

interface StoreSlugPageProps {
  params: Promise<{
    slug: string;
    path?: string[];
  }>;
}

export default async function StoreSlugPage({ params }: StoreSlugPageProps) {
  const { slug, path } = await params;
  return <ClienteRouteView slug={slug} path={path} />;
}
