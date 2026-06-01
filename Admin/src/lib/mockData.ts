export const MOCK_STORES = [
  {
    id: 'tenant-001',
    name: 'Canvas Lab',
    responsible: 'luciana@street.com',
    status: 'Activa',
    registrationDate: '10/05/2026',
    styles: ['Minimalista', 'Urbano'],
    prendas: ['Polo', 'Jean'],
    clientes: ['Millennial', 'Gen Z'],
    palette: 'core-street'
  },
  {
    id: 'tenant-002',
    name: 'Atelier Mono',
    responsible: 'carlos@atelier.com',
    status: 'Activa',
    registrationDate: '08/05/2026',
    styles: ['Clásico'],
    prendas: ['Camisa', 'Vestido'],
    clientes: ['Profesional'],
    palette: 'atelier-mono'
  },
  {
    id: 'tenant-003',
    name: 'Street/Core',
    responsible: 'maria@core.com',
    status: 'Suspendida',
    registrationDate: '05/05/2026',
    styles: ['Deportivo'],
    prendas: ['Casaca', 'Polo'],
    clientes: ['Gen Z'],
    palette: 'utility-drop'
  }
];

export const MOCK_USERS = [
  {
    name: 'Luciana Vega',
    email: 'luciana@street.com',
    role: 'Comerciante',
    store: 'Canvas Lab',
    docType: 'DNI',
    docNumber: '12345678',
    phone: '987654321',
    birthDate: '1995-03-15',
    ruc: ''
  },
  {
    name: 'Carlos Ruiz',
    email: 'carlos@atelier.com',
    role: 'Comerciante',
    store: 'Atelier Mono',
    docType: 'DNI',
    docNumber: '87654321',
    phone: '912345678',
    birthDate: '1988-07-22',
    ruc: '20123456789'
  },
  {
    name: 'Admin Kingstore',
    email: 'admin@platform.com',
    role: 'Administrador',
    store: 'Todas',
    docType: 'DNI',
    docNumber: '11223344',
    phone: '999888777',
    birthDate: '1990-01-10',
    ruc: ''
  }
];

export const MOCK_CATEGORIES = [
  {
    id: 'cat-001',
    name: 'Ropa',
    description: 'Prendas de vestir en general',
    status: 'Activa',
    use: 45
  },
  {
    id: 'cat-002',
    name: 'Accesorios',
    description: 'Complementos y accesorios de moda',
    status: 'Activa',
    use: 23
  },
  {
    id: 'cat-003',
    name: 'Calzado',
    description: 'Zapatos y zapatillas',
    status: 'Inactiva',
    use: 12
  }
];

export const MOCK_AUDIT = [
  {
    time: '14:32:18',
    user: 'admin@platform.com',
    role: 'ADMIN',
    tenant: 'Global',
    action: 'LOGIN',
    level: 'INFO'
  },
  {
    time: '14:30:45',
    user: 'luciana@street.com',
    role: 'MERCHANT',
    tenant: 'Canvas Lab',
    action: 'UPDATE_PRODUCT',
    level: 'INFO'
  },
  {
    time: '14:28:12',
    user: 'sys@platform',
    role: 'SYSTEM',
    tenant: 'Global',
    action: 'BACKUP_COMPLETED',
    level: 'INFO'
  },
  {
    time: '14:25:00',
    user: 'carlos@atelier.com',
    role: 'MERCHANT',
    tenant: 'Atelier Mono',
    action: 'CREATE_ORDER',
    level: 'INFO'
  }
];