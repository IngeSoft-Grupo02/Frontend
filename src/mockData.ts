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
    time: '2024-01-15 10:30',
    user: 'admin@platform.com',
    role: 'ADMIN',
    tenant: 'Global',
    action: 'LOGIN',
    level: 'INFO',
  },
];

export const MOCK_CATEGORIES = [
  {
    name: 'Ropa',
    description: 'Prendas de vestir',
    status: 'Activa',
    use: 45,
  },
];