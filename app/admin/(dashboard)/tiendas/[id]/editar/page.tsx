'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import {
  PRIMARY_COLORS,
  SECONDARY_COLORS,
  StoreForm,
  StoreFormValues,
  TERTIARY_COLORS,
} from '@/domains/admin/components/admin/StoreForm';
import { Button } from '@/domains/admin/components/UI';
import { api, MerchantResponseDTO, StoreResponse } from '@/domains/admin/lib/api';
import { ADMIN_ROUTES } from '@/domains/admin/lib/routes';
import { messageFromError } from '@/domains/shared/errors';

function supportedColor(value: string | null, options: { id: string }[], fallback: string) {
  return value && options.some(option => option.id === value) ? value : fallback;
}

function merchantFromStore(store: StoreResponse): MerchantResponseDTO | null {
  if (!store.merchant) return null;
  return {
    id: store.merchant.id,
    email: store.merchant.userAccount?.email ?? '',
    firstName: store.merchant.firstName,
    paternalSurname: store.merchant.paternalSurname,
    ruc: store.merchant.ruc,
  };
}

export default function EditarTiendaPage() {
  const router = useRouter();
  const params = useParams();
  const storeId = Number(params.id);
  const [store, setStore] = useState<StoreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!Number.isInteger(storeId) || storeId <= 0) {
      setLoadError('El identificador de la tienda no es válido.');
      setLoading(false);
      return () => { active = false; };
    }

    api.stores.getById(storeId)
      .then(data => {
        if (active) setStore(data);
      })
      .catch(error => {
        if (active) setLoadError(messageFromError(error, 'No se pudo cargar la tienda.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [storeId]);

  if (loading) {
    return (
      <div className="min-h-[55vh] flex items-center justify-center gap-3 text-neutral-400">
        <Loader2 size={24} className="animate-spin" /> Cargando tienda...
      </div>
    );
  }

  if (loadError || !store) {
    return (
      <div className="min-h-[55vh] flex flex-col items-center justify-center text-center gap-5 px-6">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <AlertCircle size={26} />
        </div>
        <div>
          <h2 className="text-[24px] font-display font-extrabold">No se pudo abrir la tienda</h2>
          <p className="text-[14px] text-neutral-500 mt-2 max-w-lg">{loadError || 'La tienda solicitada no existe.'}</p>
        </div>
        <Button type="button" variant="secondary" className="rounded-full px-8" onClick={() => router.push(ADMIN_ROUTES.stores)}>
          <ArrowLeft size={16} className="mr-2" /> Volver al listado
        </Button>
      </div>
    );
  }

  const initialValues: StoreFormValues = {
    storeName: store.storeName,
    slug: store.slug,
    description: store.description ?? '',
    categoryId: store.category?.id?.toString() ?? '',
    primaryColor: supportedColor(store.primaryColor, PRIMARY_COLORS, 'ONYX_BLACK'),
    secondaryColor: supportedColor(store.secondaryColor, SECONDARY_COLORS, 'SLATE'),
    tertiaryColor: supportedColor(store.tertiaryColor, TERTIARY_COLORS, 'RAW_GOLD'),
  };

  return (
    <StoreForm
      mode="edit"
      initialValues={initialValues}
      initialMerchant={merchantFromStore(store)}
      onSubmit={async (values, merchant) => {
        await api.stores.update(store.id, {
          storeName: values.storeName.trim(),
          slug: values.slug.trim(),
          description: values.description.trim(),
          categoryId: Number(values.categoryId),
          primaryColor: values.primaryColor,
          secondaryColor: values.secondaryColor,
          tertiaryColor: values.tertiaryColor,
          merchantId: merchant.id,
        });
        router.push(`${ADMIN_ROUTES.stores}?updated=1`);
      }}
    />
  );
}
