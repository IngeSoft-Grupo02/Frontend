'use client';

import { useRouter } from 'next/navigation';
import { StoreForm } from '@/domains/admin/components/admin/StoreForm';
import { api } from '@/domains/admin/lib/api';
import { ADMIN_ROUTES } from '@/domains/admin/lib/routes';

export default function NuevaTiendaPage() {
  const router = useRouter();

  return (
    <StoreForm
      mode="create"
      onSubmit={async (values, merchant) => {
        await api.stores.create({
          storeName: values.storeName.trim(),
          slug: values.slug.trim(),
          description: values.description.trim() || undefined,
          categoryId: Number(values.categoryId),
          primaryColor: values.primaryColor,
          secondaryColor: values.secondaryColor,
          tertiaryColor: values.tertiaryColor,
          merchantId: merchant.id,
        });
        router.push(ADMIN_ROUTES.stores);
      }}
    />
  );
}
