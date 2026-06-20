/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CustomerUser, TipoDocumento, User } from '../types';

// Backend: DNI | PASSPORT | FOREIGN_ID_CARD -> Frontend: DNI | CE | RUC
function toTipoDocumento(documentType: string | null | undefined): TipoDocumento {
  switch (documentType) {
    case 'DNI':
      return TipoDocumento.DNI;
    case 'PASSPORT':
    case 'FOREIGN_ID_CARD':
      return TipoDocumento.CE;
    default:
      return TipoDocumento.DNI;
  }
}

/** Adapta el perfil real del cliente (GET /stores/{slug}/customers/me) al modelo User del prototipo. */
export function mapCustomerToUser(profile: CustomerUser): User {
  return {
    id: String(profile.id),
    name: `${profile.firstName} ${profile.lastName}`.trim(),
    email: profile.email,
    phone: profile.phone,
    documentType: toTipoDocumento(profile.documentType),
    documentId: profile.documentNumber,
    storeId: profile.storeSlug,
  };
}
