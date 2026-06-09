(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Frontend/Cliente/src/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */ __turbopack_context__.s([
    "PrimaryColor",
    ()=>PrimaryColor,
    "SecondaryColor",
    ()=>SecondaryColor,
    "TertiaryColor",
    ()=>TertiaryColor,
    "TipoDocumento",
    ()=>TipoDocumento,
    "View",
    ()=>View
]);
var TipoDocumento = /*#__PURE__*/ function(TipoDocumento) {
    TipoDocumento["DNI"] = "DNI";
    TipoDocumento["CE"] = "CE";
    TipoDocumento["RUC"] = "RUC";
    return TipoDocumento;
}({});
var View = /*#__PURE__*/ function(View) {
    View["DIRECTORY"] = "DIRECTORY";
    View["STOREFRONT_PUBLIC"] = "STOREFRONT_PUBLIC";
    View["STOREFRONT_PRIVATE"] = "STOREFRONT_PRIVATE";
    View["AUTH_LOGIN"] = "AUTH_LOGIN";
    View["AUTH_REGISTER"] = "AUTH_REGISTER";
    View["AUTH_FORGOT_PASSWORD"] = "AUTH_FORGOT_PASSWORD";
    View["AUTH_VERIFICATION"] = "AUTH_VERIFICATION";
    View["AUTH_RESET_PASSWORD"] = "AUTH_RESET_PASSWORD";
    View["CATALOG"] = "CATALOG";
    View["PRODUCT_DETAIL"] = "PRODUCT_DETAIL";
    View["REQUEST_QUOTE"] = "REQUEST_QUOTE";
    View["MY_QUOTES"] = "MY_QUOTES";
    View["QUOTE_DETAIL"] = "QUOTE_DETAIL";
    View["MY_ORDERS"] = "MY_ORDERS";
    View["ORDER_DETAIL"] = "ORDER_DETAIL";
    View["CART"] = "CART";
    View["PAYMENT"] = "PAYMENT";
    View["PROFILE"] = "PROFILE";
    return View;
}({});
var PrimaryColor = /*#__PURE__*/ function(PrimaryColor) {
    PrimaryColor["ONYX_BLACK"] = "#0F1011";
    PrimaryColor["MIDNIGHT"] = "#1A2332";
    PrimaryColor["ESPRESSO"] = "#4B3621";
    PrimaryColor["ALABASTER"] = "#F9FAFB";
    PrimaryColor["WARM_CREAM"] = "#FDFBF7";
    return PrimaryColor;
}({});
var SecondaryColor = /*#__PURE__*/ function(SecondaryColor) {
    SecondaryColor["SLATE"] = "#475569";
    SecondaryColor["SAGE"] = "#8A9A86";
    SecondaryColor["TERRA"] = "#E2725B";
    SecondaryColor["GHOST_WHITE"] = "#FFFFFF";
    SecondaryColor["SOFT_TAUPE"] = "#D5CEC4";
    return SecondaryColor;
}({});
var TertiaryColor = /*#__PURE__*/ function(TertiaryColor) {
    TertiaryColor["RAW_GOLD"] = "#D4AF37";
    TertiaryColor["COPPER"] = "#B87333";
    TertiaryColor["COBALT_BLUE"] = "#2563EB";
    TertiaryColor["CORAL_PUNCH"] = "#FF5A5F";
    TertiaryColor["EMERALD"] = "#10B981";
    return TertiaryColor;
}({});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Frontend/Cliente/src/context/AppContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppProvider",
    ()=>AppProvider,
    "useApp",
    ()=>useApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/next@16.2.7_@babel+core@7.2_27554004f431be4f267c657ce343daf6/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/next@16.2.7_@babel+core@7.2_27554004f431be4f267c657ce343daf6/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/types.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AppProvider({ children }) {
    _s();
    const [currentView, setCurrentView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["View"].DIRECTORY);
    const [selectedStore, setSelectedStore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedProduct, setSelectedProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedQuote, setSelectedQuote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedOrder, setSelectedOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [cartItems, setCartItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Helper to calculate perceptual brightness of a hex color
    const getBrightness = (hexColor)=>{
        const hex = hexColor.replace('#', '');
        if (hex.length !== 6) return 0;
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        if (isNaN(r) || isNaN(g) || isNaN(b)) return 0;
        // Standard HSP / YIQ formula
        return (r * 299 + g * 587 + b * 114) / 1000;
    };
    // Function to darken a color to guarantee at least 4.5:1 text contrast on white
    const adjustColorContrast = (hexColor, targetBrightness = 110)=>{
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
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            if (selectedStore) {
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
    }["AppProvider.useEffect"], [
        selectedStore
    ]);
    const addToCart = (item)=>{
        setCartItems((prev)=>[
                ...prev,
                {
                    ...item,
                    id: `cart_${Date.now()}`
                }
            ]);
    };
    const removeFromCart = (id)=>{
        setCartItems((prev)=>prev.filter((item)=>item.id !== id));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
        value: {
            currentView,
            setCurrentView,
            selectedStore,
            setSelectedStore,
            currentUser,
            setCurrentUser,
            selectedProduct,
            setSelectedProduct,
            selectedQuote,
            setSelectedQuote,
            selectedOrder,
            setSelectedOrder,
            cartItems,
            setCartItems,
            addToCart,
            removeFromCart
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Frontend/Cliente/src/context/AppContext.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, this);
}
_s(AppProvider, "TOsIFpWV7JgaZClZPayHeZIUfSs=");
_c = AppProvider;
function useApp() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
_s1(useApp, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AppProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Frontend_Cliente_src_0es3iuu._.js.map