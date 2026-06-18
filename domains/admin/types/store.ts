export interface Store {
    id: string;
    name: string;
    responsible: string;
    status: 'active' | 'suspended' | 'inactive';
    registrationDate: string;
    styles: string[];
    prendas: string[];
    clientes: string[];
    palette: string;
  }
  
  export interface CreateStoreDto {
    name: string;
    responsible: string;
    status: string;
    styles: string[];
    prendas: string[];
    clientes: string[];
    palette: string;
  }