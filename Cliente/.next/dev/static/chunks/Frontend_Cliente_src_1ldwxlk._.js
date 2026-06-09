(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Frontend/Cliente/src/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AVAILABLE_COLORS",
    ()=>AVAILABLE_COLORS,
    "AVAILABLE_SIZES",
    ()=>AVAILABLE_SIZES,
    "ORDERS",
    ()=>ORDERS,
    "PRODUCTS",
    ()=>PRODUCTS,
    "QUOTES",
    ()=>QUOTES,
    "STORES",
    ()=>STORES
]);
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/types.ts [app-client] (ecmascript)");
;
const STORES = [
    {
        id: 's4',
        name: 'Studio 47',
        description: 'Atelier de moda urbana que redefine el concepto de elegancia callejera con cortes arquitectónicos y telas tecnológicas.',
        category: 'POLO',
        color: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PrimaryColor"].MIDNIGHT,
        logo: 'S4',
        whatsapp: '987654321',
        designFeePercentage: '10%',
        primaryColor: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PrimaryColor"].MIDNIGHT,
        secondaryColor: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SecondaryColor"].SLATE,
        tertiaryColor: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TertiaryColor"].RAW_GOLD
    },
    {
        id: 'ur',
        name: 'Urban Roots',
        description: 'Indumentaria inspirada en la conexión orgánica entre la ciudad y la naturaleza, utilizando fibras naturales y procesos de teñido botánico.',
        category: 'CASACA',
        color: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PrimaryColor"].ESPRESSO,
        logo: 'UR',
        whatsapp: '912345678',
        designFeePercentage: '15%',
        primaryColor: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PrimaryColor"].ESPRESSO,
        secondaryColor: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SecondaryColor"].SOFT_TAUPE,
        tertiaryColor: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TertiaryColor"].COPPER
    },
    {
        id: 'df',
        name: 'Denim Factory',
        description: 'Laboratorio especializado en la confección de piezas en mezclilla de alta gama, enfocados en la durabilidad y el desgaste artesanal.',
        category: 'CAMISA',
        color: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PrimaryColor"].ONYX_BLACK,
        logo: 'DF',
        whatsapp: '955443322',
        designFeePercentage: '20%',
        primaryColor: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PrimaryColor"].ONYX_BLACK,
        secondaryColor: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SecondaryColor"].SLATE,
        tertiaryColor: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TertiaryColor"].COBALT_BLUE
    },
    {
        id: 'la',
        name: 'Lumina Atelier',
        description: 'Boutique premium de estética escandinava que prioriza texturas ligeras, siluetas desestructuradas y acabados de alta costura.',
        category: 'CASACA',
        color: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PrimaryColor"].ALABASTER,
        logo: 'LA',
        whatsapp: '999888777',
        designFeePercentage: '18%',
        primaryColor: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PrimaryColor"].ALABASTER,
        secondaryColor: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SecondaryColor"].GHOST_WHITE,
        tertiaryColor: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TertiaryColor"].EMERALD
    }
];
const AVAILABLE_SIZES = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL'
];
const AVAILABLE_COLORS = [
    'BLANCO',
    'NEGRO',
    'ROJO',
    'VERDE',
    'AZUL'
];
const PRODUCTS = [
    {
        id: 'p1',
        name: 'Polo Clásico Orgánico',
        price: 28.00,
        material: 'Algodón orgánico 20/1',
        tag: 'Más vendido',
        description: 'Corte clásico con acabado premium y costuras reforzadas.',
        category: 'Slim Fit',
        colors: [
            'NEGRO',
            'BLANCO',
            'VERDE'
        ],
        sizes: [
            'S',
            'M',
            'L'
        ],
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
        colors: [
            'NEGRO',
            'VERDE',
            'AZUL'
        ],
        sizes: [
            'M',
            'L',
            'XL'
        ],
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
        colors: [
            'BLANCO',
            'AZUL'
        ],
        sizes: [
            'XS',
            'S',
            'M'
        ],
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
        colors: [
            'NEGRO',
            'ROJO'
        ],
        sizes: [
            'M',
            'L',
            'XL',
            'XXL'
        ],
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
        colors: [
            'AZUL'
        ],
        sizes: [
            'S',
            'M',
            'L',
            'XL'
        ],
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
        colors: [
            'BLANCO',
            'AZUL'
        ],
        sizes: [
            'S',
            'M',
            'L'
        ],
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
        colors: [
            'NEGRO',
            'BLANCO'
        ],
        sizes: [
            'M',
            'L'
        ],
        storeId: 'la',
        createdAt: Date.now() - 100000
    }
];
const QUOTES = [
    {
        id: '0128',
        productName: 'Polo Slim Fit Pima',
        quantity: 120,
        date: '24 abr · 10:12',
        amount: 5040,
        status: 'Pendientes',
        hasDesign: true
    },
    {
        id: '0125',
        productName: 'Polo Clásico Orgánico',
        quantity: 60,
        date: '21 abr · 09:30',
        amount: 1680,
        status: 'Aprobadas',
        hasDesign: false
    },
    {
        id: '0112',
        productName: 'Polo Oversize Texturizado',
        quantity: 500,
        date: '15 abr · 14:45',
        amount: 17000,
        status: 'Rechazadas',
        hasDesign: true
    }
];
const ORDERS = [
    {
        id: '109901',
        productName: 'Polo Clásico Orgánico',
        date: '22 abr · 11:20',
        amount: 1680,
        status: 'Pagado'
    },
    {
        id: '109854',
        productName: 'Polo Slim Fit Pima',
        date: '18 abr · 16:05',
        amount: 3200,
        status: 'En camino'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Frontend/Cliente/src/components/ui/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */ __turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/next@16.2.7_@babel+core@7.2_27554004f431be4f267c657ce343daf6/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const Button = ({ children, variant = 'primary', fullWidth = false, className = '', ...props })=>{
    const variants = {
        primary: 'bg-[var(--color-tertiary)] text-[var(--color-text-on-tertiary)] border-transparent hover:opacity-90 active:scale-[0.98]',
        secondary: 'bg-warm-bg text-text-main border-border-subtle hover:bg-border-subtle hover:text-text-main active:scale-[0.98]',
        outline: 'bg-transparent text-[var(--color-tertiary)] border-[var(--color-tertiary)] hover:bg-[var(--color-tertiary)] hover:text-[var(--color-text-on-tertiary)] active:scale-[0.98]',
        camel: 'bg-[var(--color-tertiary)] text-[var(--color-text-on-tertiary)] border-transparent hover:opacity-90 active:scale-[0.98]',
        ghost: 'bg-transparent text-text-main border-transparent hover:bg-warm-bg active:scale-[0.98]'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `
        px-6 py-2.5 rounded-[12px] font-black text-[13px] transition-all duration-200 border
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center inline-flex items-center justify-center gap-2
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/Frontend/Cliente/src/components/ui/Button.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Frontend/Cliente/src/components/layout/TopBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TopBar",
    ()=>TopBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/next@16.2.7_@babel+core@7.2_27554004f431be4f267c657ce343daf6/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/next@16.2.7_@babel+core@7.2_27554004f431be4f267c657ce343daf6/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.7/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.7/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.7/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.7/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.7/node_modules/lucide-react/dist/esm/icons/clipboard-check.js [app-client] (ecmascript) <export default as ClipboardCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.7/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/types.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const TopBar = ({ store, user, onNavigate, onLogout, showSearch = true, cartCount = 0, currentView })=>{
    _s();
    const [isDropdownOpen, setIsDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isDirectory = currentView === __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].DIRECTORY || !store;
    const headerBg = isDirectory ? '#0F1011' : '#FFFFFF';
    const headerText = isDirectory ? '#FFFFFF' : '#0F1011';
    const headerBorder = isDirectory ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "h-[80px] border-b flex items-center px-10 sticky top-0 z-[100] justify-between transition-colors duration-300",
        style: {
            backgroundColor: headerBg,
            color: headerText,
            borderColor: headerBorder
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 cursor-pointer group pr-6",
                        onClick: ()=>onNavigate(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].DIRECTORY),
                        style: {
                            color: headerText
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "logo-accent w-5 h-5 grid grid-cols-2 gap-[2px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-olive"
                                    }, void 0, false, {
                                        fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                        lineNumber: 39,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-camel"
                                    }, void 0, false, {
                                        fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                        lineNumber: 40,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                        lineNumber: 41,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-border-subtle"
                                    }, void 0, false, {
                                        fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                        lineNumber: 42,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                lineNumber: 38,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-extrabold text-[18px] tracking-tight",
                                children: "Kingstore"
                            }, void 0, false, {
                                fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    store && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-8 pl-6 border-l h-10",
                        style: {
                            borderColor: isDirectory ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-[14px] shadow-sm animate-fade-in",
                                        style: {
                                            backgroundColor: store.color
                                        },
                                        children: store.logo
                                    }, void 0, false, {
                                        fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                        lineNumber: 50,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-black text-[15px]",
                                        style: {
                                            color: headerText
                                        },
                                        children: store.name
                                    }, void 0, false, {
                                        fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                        lineNumber: 56,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                lineNumber: 49,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "flex gap-8 items-center h-full ml-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            if (typeof window.setShowFullCatalog === 'function') {
                                                window.setShowFullCatalog(false);
                                            }
                                            onNavigate(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].STOREFRONT_PUBLIC);
                                        },
                                        className: `text-[13px] transition-colors py-1 cursor-pointer ${currentView === __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].STOREFRONT_PUBLIC ? 'font-black border-b-2' : 'font-bold opacity-70 hover:opacity-100'}`,
                                        style: currentView === __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].STOREFRONT_PUBLIC ? {
                                            color: isDirectory ? '#FFFFFF' : 'var(--color-tertiary-text)',
                                            borderColor: isDirectory ? '#FFFFFF' : 'var(--color-tertiary)'
                                        } : {
                                            color: headerText
                                        },
                                        children: "Inicio"
                                    }, void 0, false, {
                                        fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                        lineNumber: 62,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            if (typeof window.setShowFullCatalog === 'function') {
                                                window.setShowFullCatalog(true);
                                            }
                                            onNavigate(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].CATALOG);
                                        },
                                        className: `text-[13px] transition-colors py-1 cursor-pointer ${currentView === __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].CATALOG ? 'font-black border-b-2' : 'font-bold opacity-70 hover:opacity-100'}`,
                                        style: currentView === __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].CATALOG ? {
                                            color: isDirectory ? '#FFFFFF' : 'var(--color-tertiary-text)',
                                            borderColor: isDirectory ? '#FFFFFF' : 'var(--color-tertiary)'
                                        } : {
                                            color: headerText
                                        },
                                        children: "Catálogo"
                                    }, void 0, false, {
                                        fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                        lineNumber: 74,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onNavigate(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].MY_QUOTES),
                                        className: `text-[13px] transition-colors py-1 cursor-pointer ${currentView === __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].MY_QUOTES ? 'font-black border-b-2' : 'font-bold opacity-70 hover:opacity-100'}`,
                                        style: currentView === __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].MY_QUOTES ? {
                                            color: isDirectory ? '#FFFFFF' : 'var(--color-tertiary-text)',
                                            borderColor: isDirectory ? '#FFFFFF' : 'var(--color-tertiary)'
                                        } : {
                                            color: headerText
                                        },
                                        children: "Cotizaciones"
                                    }, void 0, false, {
                                        fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                        lineNumber: 86,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onNavigate(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].MY_ORDERS),
                                        className: `text-[13px] transition-colors py-1 cursor-pointer ${currentView === __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].MY_ORDERS ? 'font-black border-b-2' : 'font-bold opacity-70 hover:opacity-100'}`,
                                        style: currentView === __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].MY_ORDERS ? {
                                            color: isDirectory ? '#FFFFFF' : 'var(--color-tertiary-text)',
                                            borderColor: isDirectory ? '#FFFFFF' : 'var(--color-tertiary)'
                                        } : {
                                            color: headerText
                                        },
                                        children: "Pedidos"
                                    }, void 0, false, {
                                        fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                        lineNumber: 93,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                lineNumber: 61,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                        lineNumber: 48,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-8",
                children: currentView !== __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].DIRECTORY && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onNavigate(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].CART),
                            className: "p-2 transition-all relative cursor-pointer",
                            style: {
                                color: headerText
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                    lineNumber: 114,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                cartCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute -top-0.5 -right-0.5 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 shadow-sm animate-fade-in",
                                    style: {
                                        backgroundColor: 'var(--color-tertiary)',
                                        color: 'var(--text-on-tertiary)',
                                        borderColor: headerBg
                                    },
                                    children: cartCount
                                }, void 0, false, {
                                    fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                    lineNumber: 116,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                            lineNumber: 109,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setIsDropdownOpen(!isDropdownOpen),
                                    className: "flex items-center gap-3 group cursor-pointer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-right hidden sm:block",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-[13px] font-black tracking-tight",
                                                    style: {
                                                        color: headerText
                                                    },
                                                    children: user.name
                                                }, void 0, false, {
                                                    fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-[10px] font-bold uppercase tracking-widest flex items-center justify-end gap-1 opacity-70",
                                                    style: {
                                                        color: headerText
                                                    },
                                                    children: [
                                                        "Mi cuenta ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                            size: 10,
                                                            className: `transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                                            lineNumber: 134,
                                                            columnNumber: 33
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                                    lineNumber: 133,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                            lineNumber: 131,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 rounded-xl flex items-center justify-center font-black text-[12px] shadow-sm hover:opacity-85",
                                            style: {
                                                backgroundColor: 'var(--color-tertiary)',
                                                color: 'var(--text-on-tertiary)'
                                            },
                                            children: user.name.split(' ').map((n)=>n[0]).join('')
                                        }, void 0, false, {
                                            fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                            lineNumber: 137,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                    lineNumber: 127,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                isDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute right-0 mt-4 w-60 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border overflow-hidden py-2 animate-in fade-in zoom-in duration-200 origin-top-right z-[110]",
                                    style: {
                                        backgroundColor: 'var(--color-secondary)',
                                        color: 'var(--text-on-secondary)',
                                        borderColor: 'rgba(0,0,0,0.05)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "px-4 py-3 border-b mb-1",
                                            style: {
                                                borderColor: 'rgba(0,0,0,0.05)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[11px] font-black uppercase tracking-widest mb-0.5 opacity-65",
                                                    style: {
                                                        color: 'var(--text-on-secondary)'
                                                    },
                                                    children: "Tu Cuenta"
                                                }, void 0, false, {
                                                    fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                                    lineNumber: 151,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[13px] font-bold truncate",
                                                    style: {
                                                        color: 'var(--text-on-secondary)'
                                                    },
                                                    children: user.email
                                                }, void 0, false, {
                                                    fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                                    lineNumber: 152,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                            lineNumber: 150,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                onNavigate(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].PROFILE);
                                                setIsDropdownOpen(false);
                                            },
                                            className: "w-full flex items-center gap-3 text-left px-4 py-3 text-[13px] font-bold hover:opacity-80 transition-all cursor-pointer",
                                            style: {
                                                color: 'var(--text-on-secondary)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    size: 16,
                                                    className: "opacity-70"
                                                }, void 0, false, {
                                                    fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                                    lineNumber: 160,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Editar perfil"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                            lineNumber: 155,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                onNavigate(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].MY_QUOTES);
                                                setIsDropdownOpen(false);
                                            },
                                            className: "w-full flex items-center gap-3 text-left px-4 py-3 text-[13px] font-bold hover:opacity-80 transition-all cursor-pointer",
                                            style: {
                                                color: 'var(--text-on-secondary)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__["ClipboardCheck"], {
                                                    size: 16,
                                                    className: "opacity-70"
                                                }, void 0, false, {
                                                    fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Mis cotizaciones"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                            lineNumber: 163,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                onNavigate(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].MY_ORDERS);
                                                setIsDropdownOpen(false);
                                            },
                                            className: "w-full flex items-center gap-3 text-left px-4 py-3 text-[13px] font-bold hover:opacity-80 transition-all cursor-pointer",
                                            style: {
                                                color: 'var(--text-on-secondary)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                    size: 16,
                                                    className: "opacity-70"
                                                }, void 0, false, {
                                                    fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Mis pedidos"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                            lineNumber: 171,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-1 pt-1 border-t px-2",
                                            style: {
                                                borderColor: 'rgba(0,0,0,0.05)'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    if (onLogout) onLogout();
                                                    setIsDropdownOpen(false);
                                                },
                                                className: "w-full flex items-center gap-3 text-left px-3 py-3 rounded-xl text-[13px] font-black text-red-500 hover:bg-red-500/10 transition-all cursor-pointer",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                                        lineNumber: 184,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " Cerrar sesión"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                                lineNumber: 180,
                                                columnNumber: 24
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                            lineNumber: 179,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                    lineNumber: 146,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                            lineNumber: 126,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onNavigate(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].AUTH_LOGIN),
                                    className: "text-[13px] font-black tracking-tight hover:opacity-80 transition-opacity cursor-pointer animate-fade-in",
                                    style: {
                                        color: headerText
                                    },
                                    children: "Iniciar sesión"
                                }, void 0, false, {
                                    fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                    lineNumber: 192,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "primary",
                                    onClick: ()=>onNavigate(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].AUTH_REGISTER),
                                    className: "py-2.5 px-6 rounded-xl font-black text-[13px] cursor-pointer",
                                    style: {
                                        backgroundColor: 'var(--color-tertiary)',
                                        color: 'var(--text-on-tertiary)'
                                    },
                                    children: "Registrarse"
                                }, void 0, false, {
                                    fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                                    lineNumber: 199,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                            lineNumber: 191,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Frontend/Cliente/src/components/layout/TopBar.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TopBar, "V8e9uWL0aZcxWbWsGpr6VZQUTDg=");
_c = TopBar;
var _c;
__turbopack_context__.k.register(_c, "TopBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Frontend/Cliente/src/components/ui/Badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */ __turbopack_context__.s([
    "Badge",
    ()=>Badge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/next@16.2.7_@babel+core@7.2_27554004f431be4f267c657ce343daf6/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const Badge = ({ status, className = '' })=>{
    const styles = {
        'Pendientes': 'bg-amber-100 text-amber-800 border border-amber-300 shadow-sm',
        'En revisión': 'bg-blue-100 text-blue-800 border border-blue-300 shadow-sm',
        'Propuesta enviada': 'bg-indigo-100 text-indigo-800 border border-indigo-300 shadow-sm',
        'Aprobadas': 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm',
        'Rechazadas': 'bg-rose-100 text-rose-800 border border-rose-300 shadow-sm',
        'Pagado': 'bg-cyan-100 text-cyan-800 border border-cyan-300 shadow-sm',
        'En proceso': 'bg-orange-100 text-orange-800 border border-orange-300 shadow-sm',
        'En camino': 'bg-lime-100 text-lime-800 border border-lime-300 shadow-sm',
        'Entregado': 'bg-green-100 text-green-900 border border-green-300 shadow-sm'
    };
    const currentStyle = styles[status] || 'bg-gray-100 text-gray-600';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `px-[10px] py-[4px] rounded-[20px] text-[10px] font-extrabold uppercase tracking-wider ${currentStyle} ${className}`,
        children: status
    }, void 0, false, {
        fileName: "[project]/Frontend/Cliente/src/components/ui/Badge.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Badge;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Frontend/Cliente/src/App.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>App
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/next@16.2.7_@babel+core@7.2_27554004f431be4f267c657ce343daf6/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/next@16.2.7_@babel+core@7.2_27554004f431be4f267c657ce343daf6/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Directory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/views/Directory.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Catalog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/views/Catalog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$RequestQuote$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/views/RequestQuote.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$MyQuotes$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/views/MyQuotes.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$QuoteDetail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/views/QuoteDetail.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Payment$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/views/Payment.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$MyOrders$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/views/MyOrders.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$OrderDetail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/views/OrderDetail.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Auth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/views/Auth.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$ProductDetail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/views/ProductDetail.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Cart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/views/Cart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Profile$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/views/Profile.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$40$2e$0_react_7ea1b4820433ad8864f2f384f03a8795$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/framer-motion@12.40.0_react_7ea1b4820433ad8864f2f384f03a8795/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$40$2e$0_react_7ea1b4820433ad8864f2f384f03a8795$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/framer-motion@12.40.0_react_7ea1b4820433ad8864f2f384f03a8795/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/context/AppContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
// Helper to calculate perceptual brightness of a hex color
function getBrightness(hexColor) {
    const hex = hexColor.replace('#', '');
    if (hex.length !== 6) return 0;
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return 0;
    // Standard HSP / YIQ formula
    return (r * 299 + g * 587 + b * 114) / 1000;
}
// Function to darken a color to guarantee at least 4.5:1 text contrast on white
function adjustColorContrast(hexColor, targetBrightness = 110) {
    const currentBrightness = getBrightness(hexColor);
    if (currentBrightness <= targetBrightness) {
        return hexColor; // No adjustment needed
    }
    const hex = hexColor.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    const factor = targetBrightness / currentBrightness;
    r = Math.max(0, Math.min(255, Math.floor(r * factor)));
    g = Math.max(0, Math.min(255, Math.floor(g * factor)));
    b = Math.max(0, Math.min(255, Math.floor(b * factor)));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
function App() {
    _s();
    const { currentView, setCurrentView, selectedStore, setSelectedStore, currentUser, setCurrentUser, selectedProduct, setSelectedProduct, selectedQuote, setSelectedQuote, selectedOrder, setSelectedOrder, cartItems, setCartItems } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "App.useEffect": ()=>{
            if (selectedStore && currentView !== __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].DIRECTORY) {
                const primary = selectedStore.primaryColor || selectedStore.color;
                const secondary = selectedStore.secondaryColor || '#86916B';
                const tertiary = selectedStore.tertiaryColor || '#BDA37D';
                document.documentElement.style.setProperty('--color-primary', primary);
                document.documentElement.style.setProperty('--color-secondary', secondary);
                document.documentElement.style.setProperty('--color-tertiary', tertiary);
                // Calcular perceptibilidad de brillo YIQ para garantizar contraste WCAG >= 4.5:1
                const pBright = getBrightness(primary);
                const sBright = getBrightness(secondary);
                const tBright = getBrightness(tertiary);
                const colorTextOnPrimary = pBright > 140 ? '#1a1a1a' : '#ffffff';
                const colorTextOnSecondary = sBright > 140 ? '#1a1a1a' : '#ffffff';
                const colorTextOnTertiary = tBright > 140 ? '#1a1a1a' : '#ffffff';
                document.documentElement.style.setProperty('--color-text-on-primary', colorTextOnPrimary);
                document.documentElement.style.setProperty('--color-text-on-secondary', colorTextOnSecondary);
                document.documentElement.style.setProperty('--color-text-on-tertiary', colorTextOnTertiary);
                // Compatibilidad con AGENTS.md
                document.documentElement.style.setProperty('--text-on-primary', colorTextOnPrimary);
                document.documentElement.style.setProperty('--text-on-secondary', colorTextOnSecondary);
                document.documentElement.style.setProperty('--text-on-tertiary', colorTextOnTertiary);
                // Ajuste automático de contraste para cuando se pinta texto sobre fondo blanco/claro
                const primaryText = adjustColorContrast(primary, 110);
                const secondaryText = adjustColorContrast(secondary, 110);
                const tertiaryText = adjustColorContrast(tertiary, 110);
                document.documentElement.style.setProperty('--color-primary-text', primaryText);
                document.documentElement.style.setProperty('--color-secondary-text', secondaryText);
                document.documentElement.style.setProperty('--color-tertiary-text', tertiaryText);
                // Compatibilidad regresiva con herencia de estilos
                document.documentElement.style.setProperty('--color-camel', tertiary);
                document.documentElement.style.setProperty('--color-olive', secondary);
                document.documentElement.style.setProperty('--color-camel-light', `${tertiary}22`);
            } else {
                document.documentElement.style.setProperty('--color-primary', '#000000');
                document.documentElement.style.setProperty('--color-secondary', '#86916B');
                document.documentElement.style.setProperty('--color-tertiary', '#BDA37D');
                document.documentElement.style.setProperty('--color-text-on-primary', '#ffffff');
                document.documentElement.style.setProperty('--color-text-on-secondary', '#ffffff');
                document.documentElement.style.setProperty('--color-text-on-tertiary', '#ffffff');
                document.documentElement.style.setProperty('--text-on-primary', '#ffffff');
                document.documentElement.style.setProperty('--text-on-secondary', '#ffffff');
                document.documentElement.style.setProperty('--text-on-tertiary', '#ffffff');
                document.documentElement.style.setProperty('--color-primary-text', '#1a1a1a');
                document.documentElement.style.setProperty('--color-secondary-text', '#475569');
                document.documentElement.style.setProperty('--color-tertiary-text', '#BDA37D');
                document.documentElement.style.setProperty('--color-camel', '#BDA37D');
                document.documentElement.style.setProperty('--color-olive', '#86916B');
                document.documentElement.style.setProperty('--color-camel-light', '#D1C0A5');
            }
        }
    }["App.useEffect"], [
        selectedStore,
        currentView
    ]);
    const handleSelectStore = (store)=>{
        // If the user is logged in to a different store, log them out
        if (currentUser && currentUser.storeId !== store.id) {
            setCurrentUser(null);
        }
        setSelectedStore(store);
        setCurrentView(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].STOREFRONT_PUBLIC);
    };
    const handleSelectQuote = (quote)=>{
        setSelectedQuote(quote);
        setCurrentView(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].QUOTE_DETAIL);
    };
    const handleSelectOrder = (order)=>{
        setSelectedOrder(order);
        setCurrentView(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].ORDER_DETAIL);
    };
    const addToCart = (item)=>{
        setCartItems((prev)=>[
                ...prev,
                {
                    ...item,
                    id: `cart_${Date.now()}`
                }
            ]);
        setCurrentView(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].CART);
    };
    const removeFromCart = (id)=>{
        setCartItems((prev)=>prev.filter((item)=>item.id !== id));
    };
    const handleLogin = ()=>{
        if (selectedStore) {
            setCurrentUser({
                id: 'user_1',
                name: 'Carlos Mendoza',
                email: 'carlos.mendoza@pucp.edu.pe',
                phone: '998877665',
                documentType: __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TipoDocumento"].DNI,
                documentId: '45678912',
                storeId: selectedStore.id
            });
            setCurrentView(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].CATALOG);
        }
    };
    const handleLogout = ()=>{
        setCurrentUser(null);
        if (!selectedStore) {
            setCurrentView(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].DIRECTORY);
        } else {
            setCurrentView(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].STOREFRONT_PUBLIC);
        }
    };
    const handleUpdateUser = (updatedUser)=>{
        setCurrentUser(updatedUser);
    };
    const navigateToProduct = (product)=>{
        setSelectedProduct(product);
        setCurrentView(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].PRODUCT_DETAIL);
    };
    const renderCurrentView = ()=>{
        switch(currentView){
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].DIRECTORY:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Directory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Directory"], {
                    onSelectStore: handleSelectStore,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 201,
                    columnNumber: 16
                }, this);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].STOREFRONT_PUBLIC:
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].STOREFRONT_PRIVATE:
                if (!selectedStore) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Directory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Directory"], {
                    onSelectStore: handleSelectStore,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 205,
                    columnNumber: 36
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Catalog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Catalog"], {
                    store: selectedStore,
                    user: currentUser,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout,
                    onSelectProduct: navigateToProduct,
                    cartCount: cartItems.length,
                    initialShowFullCatalog: false
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 206,
                    columnNumber: 16
                }, this);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].CATALOG:
                if (!selectedStore) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Directory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Directory"], {
                    onSelectStore: handleSelectStore,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 209,
                    columnNumber: 36
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Catalog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Catalog"], {
                    store: selectedStore,
                    user: currentUser,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout,
                    onSelectProduct: navigateToProduct,
                    cartCount: cartItems.length,
                    initialShowFullCatalog: true
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 210,
                    columnNumber: 16
                }, this);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].AUTH_LOGIN:
                if (!selectedStore) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Directory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Directory"], {
                    onSelectStore: handleSelectStore,
                    onNavigate: setCurrentView
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 213,
                    columnNumber: 36
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Auth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Auth"], {
                    store: selectedStore,
                    type: "login",
                    onNavigate: setCurrentView,
                    onLogin: handleLogin
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 214,
                    columnNumber: 16
                }, this);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].AUTH_REGISTER:
                if (!selectedStore) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Directory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Directory"], {
                    onSelectStore: handleSelectStore,
                    onNavigate: setCurrentView
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 217,
                    columnNumber: 36
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Auth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Auth"], {
                    store: selectedStore,
                    type: "register",
                    onNavigate: setCurrentView,
                    onLogin: handleLogin
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 218,
                    columnNumber: 16
                }, this);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].AUTH_FORGOT_PASSWORD:
                if (!selectedStore) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Directory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Directory"], {
                    onSelectStore: handleSelectStore,
                    onNavigate: setCurrentView
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 221,
                    columnNumber: 36
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Auth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Auth"], {
                    store: selectedStore,
                    type: "forgot-password",
                    onNavigate: setCurrentView,
                    onLogin: handleLogin
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 222,
                    columnNumber: 16
                }, this);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].AUTH_VERIFICATION:
                if (!selectedStore) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Directory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Directory"], {
                    onSelectStore: handleSelectStore,
                    onNavigate: setCurrentView
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 225,
                    columnNumber: 36
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Auth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Auth"], {
                    store: selectedStore,
                    type: "verification",
                    onNavigate: setCurrentView,
                    onLogin: handleLogin
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 226,
                    columnNumber: 16
                }, this);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].AUTH_RESET_PASSWORD:
                if (!selectedStore) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Directory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Directory"], {
                    onSelectStore: handleSelectStore,
                    onNavigate: setCurrentView
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 229,
                    columnNumber: 36
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Auth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Auth"], {
                    store: selectedStore,
                    type: "reset-password",
                    onNavigate: setCurrentView,
                    onLogin: handleLogin
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 230,
                    columnNumber: 16
                }, this);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].PRODUCT_DETAIL:
                if (!selectedStore || !selectedProduct) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Catalog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Catalog"], {
                    store: selectedStore,
                    user: currentUser,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout,
                    onSelectProduct: navigateToProduct,
                    cartCount: cartItems.length
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 233,
                    columnNumber: 56
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$ProductDetail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductDetail"], {
                    store: selectedStore,
                    user: currentUser,
                    product: selectedProduct,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout,
                    cartCount: cartItems.length
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 234,
                    columnNumber: 16
                }, this);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].REQUEST_QUOTE:
                if (!selectedStore) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Directory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Directory"], {
                    onSelectStore: handleSelectStore,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 237,
                    columnNumber: 36
                }, this);
                if (!currentUser) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Auth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Auth"], {
                    store: selectedStore,
                    type: "login",
                    onNavigate: setCurrentView,
                    onLogin: handleLogin
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 238,
                    columnNumber: 34
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$RequestQuote$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RequestQuote"], {
                    store: selectedStore,
                    user: currentUser,
                    product: selectedProduct,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout,
                    onAddToCart: addToCart,
                    cartCount: cartItems.length
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 239,
                    columnNumber: 16
                }, this);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].CART:
                if (!selectedStore) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Directory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Directory"], {
                    onSelectStore: handleSelectStore,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 242,
                    columnNumber: 36
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Cart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cart"], {
                    store: selectedStore,
                    user: currentUser,
                    items: cartItems,
                    onRemoveItem: removeFromCart,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 243,
                    columnNumber: 16
                }, this);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].MY_QUOTES:
                if (!selectedStore) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Directory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Directory"], {
                    onSelectStore: handleSelectStore,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 246,
                    columnNumber: 36
                }, this);
                if (!currentUser) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Auth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Auth"], {
                    store: selectedStore,
                    type: "login",
                    onNavigate: setCurrentView,
                    onLogin: handleLogin
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 247,
                    columnNumber: 34
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$MyQuotes$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MyQuotes"], {
                    store: selectedStore,
                    user: currentUser,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout,
                    onSelectQuote: handleSelectQuote,
                    cartCount: cartItems.length
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 248,
                    columnNumber: 16
                }, this);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].QUOTE_DETAIL:
                if (!selectedStore || !selectedQuote) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$MyQuotes$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MyQuotes"], {
                    store: selectedStore,
                    user: currentUser,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout,
                    onSelectQuote: handleSelectQuote,
                    cartCount: cartItems.length
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 251,
                    columnNumber: 54
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$QuoteDetail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuoteDetail"], {
                    store: selectedStore,
                    user: currentUser,
                    quote: selectedQuote,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout,
                    cartCount: cartItems.length
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 252,
                    columnNumber: 16
                }, this);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].PAYMENT:
                if (!selectedStore || !selectedQuote) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$MyQuotes$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MyQuotes"], {
                    store: selectedStore,
                    user: currentUser,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout,
                    onSelectQuote: handleSelectQuote,
                    cartCount: cartItems.length
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 255,
                    columnNumber: 54
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Payment$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Payment"], {
                    store: selectedStore,
                    user: currentUser,
                    quote: selectedQuote,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout,
                    cartCount: cartItems.length
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 256,
                    columnNumber: 16
                }, this);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].MY_ORDERS:
                if (!selectedStore) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Directory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Directory"], {
                    onSelectStore: handleSelectStore,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 259,
                    columnNumber: 36
                }, this);
                if (!currentUser) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Auth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Auth"], {
                    store: selectedStore,
                    type: "login",
                    onNavigate: setCurrentView,
                    onLogin: handleLogin
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 260,
                    columnNumber: 34
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$MyOrders$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MyOrders"], {
                    store: selectedStore,
                    user: currentUser,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout,
                    onSelectOrder: handleSelectOrder,
                    cartCount: cartItems.length
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 261,
                    columnNumber: 16
                }, this);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].ORDER_DETAIL:
                if (!selectedStore || !selectedOrder) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$MyOrders$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MyOrders"], {
                    store: selectedStore,
                    user: currentUser,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout,
                    onSelectOrder: handleSelectOrder,
                    cartCount: cartItems.length
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 264,
                    columnNumber: 54
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$OrderDetail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrderDetail"], {
                    store: selectedStore,
                    user: currentUser,
                    order: selectedOrder,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout,
                    cartCount: cartItems.length
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 265,
                    columnNumber: 16
                }, this);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].PROFILE:
                if (!selectedStore || !currentUser) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Directory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Directory"], {
                    onSelectStore: handleSelectStore,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 268,
                    columnNumber: 52
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Profile$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Profile"], {
                    store: selectedStore,
                    user: currentUser,
                    onNavigate: setCurrentView,
                    onLogout: handleLogout,
                    onUpdateUser: handleUpdateUser,
                    cartCount: cartItems.length
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 269,
                    columnNumber: 16
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$views$2f$Directory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Directory"], {
                    onSelectStore: handleSelectStore,
                    onNavigate: setCurrentView
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/App.tsx",
                    lineNumber: 272,
                    columnNumber: 16
                }, this);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "text-text-main font-sans",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$40$2e$0_react_7ea1b4820433ad8864f2f384f03a8795$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            mode: "wait",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$40$2e$0_react_7ea1b4820433ad8864f2f384f03a8795$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                exit: {
                    opacity: 0
                },
                transition: {
                    duration: 0.3
                },
                children: renderCurrentView()
            }, currentView, false, {
                fileName: "[project]/Frontend/Cliente/src/App.tsx",
                lineNumber: 279,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Frontend/Cliente/src/App.tsx",
            lineNumber: 278,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Frontend/Cliente/src/App.tsx",
        lineNumber: 277,
        columnNumber: 5
    }, this);
}
_s(App, "xPtfnCxv1w+zlZFpNjsSJOWFUIU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"]
    ];
});
_c = App;
var _c;
__turbopack_context__.k.register(_c, "App");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Frontend/Cliente/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/next@16.2.7_@babel+core@7.2_27554004f431be4f267c657ce343daf6/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$App$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/App.tsx [app-client] (ecmascript)");
'use client';
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$App$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/Frontend/Cliente/src/app/page.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Frontend_Cliente_src_1ldwxlk._.js.map