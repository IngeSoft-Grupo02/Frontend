/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Store, Product, Quote, Order, PrimaryColor, SecondaryColor, TertiaryColor } from './types';

export const STORES: Store[] = [
  { 
    id: 's4', 
    name: 'Studio 47', 
    description: 'Atelier de moda urbana que redefine el concepto de elegancia callejera con cortes arquitectónicos y telas tecnológicas.', 
    category: 'POLO', 
    color: PrimaryColor.MIDNIGHT, 
    logo: 'S4', 
    whatsapp: '987654321', 
    designFeePercentage: '10%',
    primaryColor: PrimaryColor.MIDNIGHT,
    secondaryColor: SecondaryColor.SLATE,
    tertiaryColor: TertiaryColor.RAW_GOLD
  },
  { 
    id: 'ur', 
    name: 'Urban Roots', 
    description: 'Indumentaria inspirada en la conexión orgánica entre la ciudad y la naturaleza, utilizando fibras naturales y procesos de teñido botánico.', 
    category: 'CASACA', 
    color: PrimaryColor.ESPRESSO, 
    logo: 'UR', 
    whatsapp: '912345678', 
    designFeePercentage: '15%',
    primaryColor: PrimaryColor.ESPRESSO,
    secondaryColor: SecondaryColor.SOFT_TAUPE,
    tertiaryColor: TertiaryColor.COPPER
  },
  { 
    id: 'df', 
    name: 'Denim Factory', 
    description: 'Laboratorio especializado en la confección de piezas en mezclilla de alta gama, enfocados en la durabilidad y el desgaste artesanal.', 
    category: 'CAMISA', 
    color: PrimaryColor.ONYX_BLACK, 
    logo: 'DF', 
    whatsapp: '955443322', 
    designFeePercentage: '20%',
    primaryColor: PrimaryColor.ONYX_BLACK,
    secondaryColor: SecondaryColor.SLATE,
    tertiaryColor: TertiaryColor.COBALT_BLUE
  },
  { 
    id: 'la', 
    name: 'Lumina Atelier', 
    description: 'Boutique premium de estética escandinava que prioriza texturas ligeras, siluetas desestructuradas y acabados de alta costura.', 
    category: 'CASACA', 
    color: PrimaryColor.ALABASTER, 
    logo: 'LA', 
    whatsapp: '999888777', 
    designFeePercentage: '18%',
    primaryColor: PrimaryColor.ALABASTER,
    secondaryColor: SecondaryColor.GHOST_WHITE,
    tertiaryColor: TertiaryColor.EMERALD
  },
];

export const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const AVAILABLE_COLORS = ['BLANCO', 'NEGRO', 'ROJO', 'VERDE', 'AZUL'];

export const PRODUCTS: Product[] = [
  { 
    id: 'p1', 
    name: 'Polo Clásico Orgánico', 
    price: 28.00, 
    material: 'Algodón orgánico 20/1', 
    tag: 'Más vendido', 
    description: 'Corte clásico con acabado premium y costuras reforzadas.',
    category: 'Slim Fit',
    colors: ['NEGRO', 'BLANCO', 'VERDE'],
    sizes: ['S', 'M', 'L'],
    storeId: 's4',
    createdAt: Date.now() - 1000000
  },
  { 
    id: 'p2', 
    name: 'Polo Oversize Texturizado', 
    price: 34.00, 
    material: 'Algodón peinado 40/1', 
    tag: 'Personalizable', 
    description: 'Silueta moderna con caída pesada y tacto suave.',
    category: 'Oversize',
    colors: ['NEGRO', 'VERDE', 'AZUL'],
    sizes: ['M', 'L', 'XL'],
    storeId: 's4',
    createdAt: Date.now() - 2000000
  },
  { 
    id: 'p3', 
    name: 'Polo Slim Fit Pima', 
    price: 42.00, 
    material: 'Algodón Pima certificado', 
    tag: 'Nuevo', 
    description: 'El algodón más fino del mundo para un ajuste perfecto.',
    category: 'Slim Fit',
    colors: ['BLANCO', 'AZUL'],
    sizes: ['XS', 'S', 'M'],
    storeId: 's4',
    createdAt: Date.now()
  },
  { 
    id: 'p4', 
    name: 'Polo Vintage Washed', 
    price: 38.00, 
    material: 'Jersey tacto frío', 
    description: 'Efecto desgastado con tintura artesanal única.',
    category: 'Edición limitada',
    colors: ['NEGRO', 'ROJO'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    storeId: 'ur',
    createdAt: Date.now() - 5000000
  },
  { 
    id: 'p5', 
    name: 'Casaca Denim Stonewash', 
    price: 180.00, 
    material: 'Denim premium 14oz', 
    tag: 'Esencial',
    description: 'Casaca vaquera clásica con lavado artesanal stonewash de alta resistencia.',
    category: 'Premium Denim',
    colors: ['AZUL'],
    sizes: ['S', 'M', 'L', 'XL'],
    storeId: 'df',
    createdAt: Date.now() - 3000000
  },
  { 
    id: 'p6', 
    name: 'Camisa Algodón Lino Relajada', 
    price: 95.00, 
    material: '55% Lino / 45% Algodón', 
    tag: 'Fresco',
    description: 'Camisa ultra ligera de corte holgado perfecta para climas cálidos y un look sofisticado.',
    category: 'Lino Colección',
    colors: ['BLANCO', 'AZUL'],
    sizes: ['S', 'M', 'L'],
    storeId: 'la',
    createdAt: Date.now() - 4000000
  },
  { 
    id: 'p7', 
    name: 'Sobretodo Lana Minimalista', 
    price: 240.00, 
    material: 'Mezcla de Lana y Alpaca', 
    tag: 'Exclusivo',
    description: 'Abrigo ligero sin costuras visibles, silueta limpia de corte escandinavo.',
    category: 'Sastrería',
    colors: ['NEGRO', 'BLANCO'],
    sizes: ['M', 'L'],
    storeId: 'la',
    createdAt: Date.now() - 100000
  }
];

export const QUOTES: Quote[] = [
  { id: '0128', productName: 'Polo Slim Fit Pima', quantity: 120, date: '24 abr · 10:12', amount: 5040, status: 'Pendientes', hasDesign: true },
  { id: '0125', productName: 'Polo Clásico Orgánico', quantity: 60, date: '21 abr · 09:30', amount: 1680, status: 'Aprobadas', hasDesign: false },
  { id: '0112', productName: 'Polo Oversize Texturizado', quantity: 500, date: '15 abr · 14:45', amount: 17000, status: 'Rechazadas', hasDesign: true },
];

export const ORDERS: Order[] = [
  { id: '109901', productName: 'Polo Clásico Orgánico', date: '22 abr · 11:20', amount: 1680, status: 'Pagado' },
  { id: '109854', productName: 'Polo Slim Fit Pima', date: '18 abr · 16:05', amount: 3200, status: 'En camino' },
];
