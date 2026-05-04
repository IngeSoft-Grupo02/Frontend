export const MOCK_STORES = [
  {
    id: 'tenant-001',
    name: 'Canvas Lab',
    responsible: 'admin@canvas.com',
    status: 'Activa',
    registrationDate: '01/01/2024',
    styles: ['Casual'],
    prendas: ['Polo'],
    clientes: ['Dama'],
    palette: 'core-street',
  },
];

export const MOCK_USERS = [
  {
    name: 'Admin Platform',
    email: 'admin@platform.com',
    role: 'Administrador',
    store: 'N/A',
  },
];

export const MOCK_AUDIT = [
  {
    time: '2026-05-05 10:30:00',
    user: 'admin@platform.com',
    role: 'Super Admin',
    tenant: 'Global',
    action: 'LOGIN',
    level: 'INFO',
  },
  {
    time: '2026-05-05 10:32:15',
    user: 'admin@platform.com',
    role: 'Super Admin',
    tenant: 'Canvas Lab',
    action: 'CREATE_STORE',
    level: 'SUCCESS',
  },
  {
    time: '2026-05-05 10:45:22',
    user: 'system',
    role: 'System',
    tenant: 'Urban Style',
    action: 'SYNC_FAILED',
    level: 'WARNING',
  },
  {
    time: '2026-05-05 11:00:05',
    user: 'lucia@canvas.com',
    role: 'Merchant',
    tenant: 'Canvas Lab',
    action: 'UPDATE_PRODUCT',
    level: 'ERROR',
  },
];

export const MOCK_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Ropa',
    description: 'Prendas de vestir y accesorios textiles',
    status: 'Activa',
    use: 45,
    assignedStores: ['tenant-001', 'tenant-002']
  },
  {
    id: 'cat-2',
    name: 'Accesorios',
    description: 'Complementos y artículos adicionales',
    status: 'Activa',
    use: 32,
    assignedStores: ['tenant-001']
  },
  {
    id: 'cat-3',
    name: 'Calzado',
    description: 'Zapatos, zapatillas y botas',
    status: 'Inactiva',
    use: 18,
    assignedStores: []
  },
];
