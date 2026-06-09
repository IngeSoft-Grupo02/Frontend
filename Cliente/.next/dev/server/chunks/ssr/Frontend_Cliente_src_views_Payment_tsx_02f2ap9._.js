module.exports = [
"[project]/Frontend/Cliente/src/views/Payment.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Payment",
    ()=>Payment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/next@16.2.7_@babel+core@7.2_27554004f431be4f267c657ce343daf6/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/next@16.2.7_@babel+core@7.2_27554004f431be4f267c657ce343daf6/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$40$2e$0_react_7ea1b4820433ad8864f2f384f03a8795$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/framer-motion@12.40.0_react_7ea1b4820433ad8864f2f384f03a8795/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.7/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-ssr] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.7/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.7/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.7/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.7/node_modules/lucide-react/dist/esm/icons/lock.js [app-ssr] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.7/node_modules/lucide-react/dist/esm/icons/info.js [app-ssr] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.7/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-ssr] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/Frontend/Cliente/node_modules/.pnpm/lucide-react@0.546.0_react@19.2.7/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$components$2f$layout$2f$TopBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/components/layout/TopBar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Frontend/Cliente/src/components/ui/Button.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
const Payment = ({ store, user, quote, onNavigate, onLogout, cartCount })=>{
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSuccess, setIsSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [voucherType, setVoucherType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('boleta');
    const [extraId, setExtraId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [shippingAddress, setShippingAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [shippingReference, setShippingReference] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    // Card states for validation
    const [cardNumber, setCardNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [expiry, setExpiry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [cvc, setCvc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [cardName, setCardName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const isFormValid = ()=>{
        const cleanCard = cardNumber.replace(/\s/g, '');
        const isVisa = cleanCard.startsWith('4');
        const hasCorrectLength = cleanCard.length === 16;
        const hasExpiry = /^\d{2}\s\/\s\d{2}$/.test(expiry);
        const hasCvc = /^\d{3}$/.test(cvc);
        const hasName = cardName.trim().length > 3;
        const hasAddress = shippingAddress.trim().length > 5;
        // Check extra IDs if needed
        let hasExtraId = true;
        if (voucherType === 'factura' && user?.documentType !== 'RUC') {
            hasExtraId = extraId.length === 11; // Basic RUC length in Peru
        } else if (voucherType === 'boleta' && user?.documentType === 'RUC') {
            hasExtraId = extraId.length === 8; // Basic DNI length 
        }
        return isVisa && hasCorrectLength && hasExpiry && hasCvc && hasName && hasExtraId && hasAddress;
    };
    const handlePayment = (e)=>{
        e.preventDefault();
        if (!isFormValid()) return;
        setIsProcessing(true);
        // Simulate payment gateway processing
        setTimeout(()=>{
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2500);
    };
    const handleCardNumberChange = (e)=>{
        let val = e.target.value.replace(/\D/g, '');
        val = val.substring(0, 16);
        const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardNumber(formatted);
    };
    const handleExpiryChange = (e)=>{
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 4) val = val.substring(0, 4);
        if (val.length >= 2) {
            setExpiry(`${val.substring(0, 2)} / ${val.substring(2)}`);
        } else {
            setExpiry(val);
        }
    };
    const handleCvcChange = (e)=>{
        setCvc(e.target.value.replace(/\D/g, '').substring(0, 3));
    };
    if (isSuccess) {
        const orderId = Math.floor(100000 + Math.random() * 900000);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen transition-colors duration-300 flex flex-col",
            style: {
                backgroundColor: '#FFFFFF',
                color: '#0F1011'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$components$2f$layout$2f$TopBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TopBar"], {
                    store: store,
                    user: user,
                    onNavigate: onNavigate,
                    onLogout: onLogout,
                    cartCount: cartCount
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 flex items-center justify-center p-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$40$2e$0_react_7ea1b4820433ad8864f2f384f03a8795$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            scale: 0.8
                        },
                        animate: {
                            opacity: 1,
                            scale: 1
                        },
                        className: "max-w-xl w-full rounded-[40px] border p-16 text-center shadow-2xl relative overflow-hidden",
                        style: {
                            backgroundColor: 'var(--color-secondary)',
                            color: 'var(--text-on-secondary)',
                            borderColor: 'rgba(0,0,0,0.05)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative z-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl",
                                    style: {
                                        backgroundColor: 'var(--color-tertiary)',
                                        color: 'var(--text-on-tertiary)'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                        size: 56,
                                        strokeWidth: 2.5
                                    }, void 0, false, {
                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                        lineNumber: 103,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                    lineNumber: 102,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-[42px] font-black mb-4 tracking-tighter",
                                    style: {
                                        color: 'var(--text-on-secondary)'
                                    },
                                    children: "¡Pago Satisfactorio!"
                                }, void 0, false, {
                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                    lineNumber: 106,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inline-flex items-center gap-2 px-8 py-3 rounded-2xl border mb-10",
                                    style: {
                                        backgroundColor: 'var(--color-primary)',
                                        borderColor: 'rgba(0,0,0,0.05)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[11px] font-black uppercase tracking-[0.2em] opacity-60",
                                            style: {
                                                color: 'var(--text-on-primary)'
                                            },
                                            children: "N° de Pedido:"
                                        }, void 0, false, {
                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                            lineNumber: 109,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[20px] font-black tracking-tight",
                                            style: {
                                                color: 'var(--color-tertiary)'
                                            },
                                            children: orderId
                                        }, void 0, false, {
                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                            lineNumber: 110,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                    lineNumber: 108,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[18px] font-bold mb-12 max-w-sm mx-auto leading-snug opacity-80",
                                    style: {
                                        color: 'var(--text-on-secondary)'
                                    },
                                    children: "Tu transacción ha sido validada correctamente. Tu pedido ha sido registrado con éxito."
                                }, void 0, false, {
                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                    lineNumber: 113,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col sm:flex-row gap-4 max-w-md mx-auto",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "primary",
                                            fullWidth: true,
                                            className: "py-5 text-[15px] font-black shadow-xl cursor-pointer",
                                            style: {
                                                backgroundColor: 'var(--color-tertiary)',
                                                color: 'var(--text-on-tertiary)'
                                            },
                                            onClick: ()=>onNavigate(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["View"].MY_ORDERS),
                                            children: "Ver mis pedidos"
                                        }, void 0, false, {
                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                            lineNumber: 118,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            fullWidth: true,
                                            className: "py-5 text-[15px] font-black border-2 cursor-pointer",
                                            style: {
                                                backgroundColor: 'var(--color-primary)',
                                                color: 'var(--text-on-primary)',
                                                borderColor: 'rgba(0,0,0,0.1)'
                                            },
                                            onClick: ()=>onNavigate(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["View"].CATALOG),
                                            children: "Seguir comprando"
                                        }, void 0, false, {
                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                            lineNumber: 127,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                    lineNumber: 117,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                            lineNumber: 101,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                        lineNumber: 95,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
            lineNumber: 92,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen transition-colors duration-300",
        style: {
            backgroundColor: '#FFFFFF',
            color: '#0F1011'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$components$2f$layout$2f$TopBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TopBar"], {
                store: store,
                user: user,
                onNavigate: onNavigate,
                onLogout: onLogout,
                cartCount: cartCount
            }, void 0, false, {
                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-6xl mx-auto px-10 py-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onNavigate(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["View"].QUOTE_DETAIL),
                        className: "flex items-center gap-2 text-[13px] font-bold transition-colors mb-10 cursor-pointer",
                        style: {
                            color: '#475569'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            " Volver al detalle"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-3 gap-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lg:col-span-2 space-y-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                        className: "mb-8",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-[34px] font-extrabold mb-2",
                                                style: {
                                                    color: '#0F1011'
                                                },
                                                children: "Pasarela de Pago"
                                            }, void 0, false, {
                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                lineNumber: 161,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium opacity-75",
                                                style: {
                                                    color: '#475569'
                                                },
                                                children: "Conexión cifrada de extremo a extremo."
                                            }, void 0, false, {
                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                lineNumber: 162,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                        lineNumber: 160,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        id: "payment-form",
                                        className: "rounded-3xl border p-10 shadow-sm space-y-8",
                                        style: {
                                            backgroundColor: 'var(--color-secondary)',
                                            color: 'var(--text-on-secondary)',
                                            borderColor: 'rgba(0,0,0,0.05)'
                                        },
                                        onSubmit: handlePayment,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-[11px] font-bold uppercase tracking-widest px-1 opacity-80",
                                                                style: {
                                                                    color: 'var(--text-on-secondary)'
                                                                },
                                                                children: "Tipo de Comprobante"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 173,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "grid grid-cols-2 gap-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>setVoucherType('boleta'),
                                                                        className: "py-4 px-6 rounded-2xl border-2 transition-all font-black text-[14px] flex items-center justify-center gap-3 cursor-pointer",
                                                                        style: {
                                                                            borderColor: voucherType === 'boleta' ? 'var(--color-tertiary)' : 'rgba(0,0,0,0.1)',
                                                                            backgroundColor: voucherType === 'boleta' ? 'var(--color-primary)' : 'var(--color-secondary)',
                                                                            color: 'var(--text-on-secondary)'
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "w-4 h-4 rounded-full border border-2 flex items-center justify-center",
                                                                                style: {
                                                                                    borderColor: voucherType === 'boleta' ? 'var(--color-tertiary)' : 'rgba(0,0,0,0.2)'
                                                                                },
                                                                                children: voucherType === 'boleta' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "w-2 h-2 rounded-full",
                                                                                    style: {
                                                                                        backgroundColor: 'var(--color-tertiary)'
                                                                                    }
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                                    lineNumber: 186,
                                                                                    columnNumber: 54
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                                lineNumber: 185,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            "Boleta de Venta"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 175,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>setVoucherType('factura'),
                                                                        className: "py-4 px-6 rounded-2xl border-2 transition-all font-black text-[14px] flex items-center justify-center gap-3 cursor-pointer",
                                                                        style: {
                                                                            borderColor: voucherType === 'factura' ? 'var(--color-tertiary)' : 'rgba(0,0,0,0.1)',
                                                                            backgroundColor: voucherType === 'factura' ? 'var(--color-primary)' : 'var(--color-secondary)',
                                                                            color: 'var(--text-on-secondary)'
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "w-4 h-4 rounded-full border border-2 flex items-center justify-center",
                                                                                style: {
                                                                                    borderColor: voucherType === 'factura' ? 'var(--color-tertiary)' : 'rgba(0,0,0,0.2)'
                                                                                },
                                                                                children: voucherType === 'factura' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "w-2 h-2 rounded-full",
                                                                                    style: {
                                                                                        backgroundColor: 'var(--color-tertiary)'
                                                                                    }
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                                    lineNumber: 201,
                                                                                    columnNumber: 55
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                                lineNumber: 200,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            "Factura"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 190,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 174,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                        lineNumber: 172,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    voucherType === 'factura' && user?.documentType !== 'RUC' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$40$2e$0_react_7ea1b4820433ad8864f2f384f03a8795$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                                        initial: {
                                                            opacity: 0,
                                                            y: -10
                                                        },
                                                        animate: {
                                                            opacity: 1,
                                                            y: 0
                                                        },
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-[11px] font-bold uppercase tracking-widest px-1 opacity-80",
                                                                style: {
                                                                    color: 'var(--text-on-secondary)'
                                                                },
                                                                children: "Número de RUC (RUC)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 211,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                placeholder: "Ingrese los 11 dígitos de su RUC",
                                                                value: extraId,
                                                                onChange: (e)=>setExtraId(e.target.value.replace(/\D/g, '').substring(0, 11)),
                                                                className: "w-full px-6 py-4 rounded-xl font-black text-[15px] border focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-mono",
                                                                style: {
                                                                    backgroundColor: 'var(--color-primary)',
                                                                    color: 'var(--text-on-primary)',
                                                                    borderColor: 'rgba(0,0,0,0.05)'
                                                                },
                                                                required: true
                                                            }, void 0, false, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 212,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] font-bold px-1 flex items-center gap-1",
                                                                style: {
                                                                    color: 'var(--color-tertiary)'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                                        size: 12
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 222,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Para emitir Factura es necesario un número de RUC válido."
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 221,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                        lineNumber: 210,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    voucherType === 'boleta' && user?.documentType === 'RUC' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$40$2e$0_react_7ea1b4820433ad8864f2f384f03a8795$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                                        initial: {
                                                            opacity: 0,
                                                            y: -10
                                                        },
                                                        animate: {
                                                            opacity: 1,
                                                            y: 0
                                                        },
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-[11px] font-bold uppercase tracking-widest px-1 opacity-80",
                                                                style: {
                                                                    color: 'var(--text-on-secondary)'
                                                                },
                                                                children: "Número de DNI"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 229,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                placeholder: "Ingrese los 8 dígitos de su DNI",
                                                                value: extraId,
                                                                onChange: (e)=>setExtraId(e.target.value.replace(/\D/g, '').substring(0, 8)),
                                                                className: "w-full px-6 py-4 rounded-xl font-black text-[15px] border focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-mono",
                                                                style: {
                                                                    backgroundColor: 'var(--color-primary)',
                                                                    color: 'var(--text-on-primary)',
                                                                    borderColor: 'rgba(0,0,0,0.05)'
                                                                },
                                                                required: true
                                                            }, void 0, false, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 230,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] font-bold px-1 flex items-center gap-1",
                                                                style: {
                                                                    color: 'var(--color-tertiary)'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                                        size: 12
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 240,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Su cuenta está registrada con RUC, para Boleta necesitamos un DNI."
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 239,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                        lineNumber: 228,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "pt-6 border-t space-y-6",
                                                        style: {
                                                            borderColor: 'rgba(0,0,0,0.05)'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-[14px] font-black uppercase tracking-widest flex items-center gap-2",
                                                                style: {
                                                                    color: 'var(--text-on-secondary)'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                        size: 18,
                                                                        style: {
                                                                            color: 'var(--color-tertiary)'
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 247,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Datos de Envío"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 246,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-[11px] font-bold uppercase tracking-widest px-1 opacity-80",
                                                                        style: {
                                                                            color: 'var(--text-on-secondary)'
                                                                        },
                                                                        children: "Dirección de Envío"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 250,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        placeholder: "Calle, Número, Urbanización, Distrito",
                                                                        value: shippingAddress,
                                                                        onChange: (e)=>setShippingAddress(e.target.value),
                                                                        className: "w-full px-6 py-4 rounded-xl font-black text-[15px] border focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-sans",
                                                                        style: {
                                                                            backgroundColor: 'var(--color-primary)',
                                                                            color: 'var(--text-on-primary)',
                                                                            borderColor: 'rgba(0,0,0,0.05)'
                                                                        },
                                                                        required: true
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 251,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 249,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-[11px] font-bold uppercase tracking-widest px-1 opacity-80",
                                                                        style: {
                                                                            color: 'var(--text-on-secondary)'
                                                                        },
                                                                        children: "Referencia"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 262,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        placeholder: "Ej: Frente al parque, casa color verde, etc.",
                                                                        value: shippingReference,
                                                                        onChange: (e)=>setShippingReference(e.target.value),
                                                                        className: "w-full px-6 py-4 rounded-xl font-black text-[15px] border focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-sans",
                                                                        style: {
                                                                            backgroundColor: 'var(--color-primary)',
                                                                            color: 'var(--text-on-primary)',
                                                                            borderColor: 'rgba(0,0,0,0.05)'
                                                                        },
                                                                        required: true
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 263,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 261,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                        lineNumber: 245,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                lineNumber: 171,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between p-6 rounded-2xl border",
                                                style: {
                                                    backgroundColor: 'var(--color-primary)',
                                                    borderColor: 'rgba(0,0,0,0.05)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border",
                                                                style: {
                                                                    backgroundColor: 'var(--color-secondary)',
                                                                    borderColor: 'rgba(0,0,0,0.05)'
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"], {
                                                                    size: 24,
                                                                    style: {
                                                                        color: 'var(--color-tertiary)'
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                    lineNumber: 279,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 278,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-[14px] font-black",
                                                                        style: {
                                                                            color: 'var(--text-on-primary)'
                                                                        },
                                                                        children: "Tarjeta VISA"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 282,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-[11px] font-bold uppercase tracking-wider opacity-60",
                                                                        style: {
                                                                            color: 'var(--text-on-primary)'
                                                                        },
                                                                        children: "Única tarjeta de pago aceptada"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 283,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 281,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                        lineNumber: 277,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-8 w-12 bg-[#1A1F71] rounded-md flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white font-black text-[10px] italic",
                                                                children: "VISA"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 288,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                            lineNumber: 287,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                        lineNumber: 286,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                lineNumber: 276,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-[11px] font-bold uppercase tracking-widest flex items-center justify-between px-1 opacity-80",
                                                                style: {
                                                                    color: 'var(--text-on-secondary)'
                                                                },
                                                                children: [
                                                                    "Número de Tarjeta",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded",
                                                                        children: "SÓLO VISA (EMPIEZA CON 4)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 297,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 295,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        placeholder: "4000 0000 0000 0000",
                                                                        value: cardNumber,
                                                                        onChange: handleCardNumberChange,
                                                                        className: "w-full px-6 py-4 rounded-xl font-black text-[16px] border transition-all font-mono focus:outline-none",
                                                                        style: {
                                                                            backgroundColor: 'var(--color-primary)',
                                                                            color: 'var(--text-on-primary)',
                                                                            borderColor: cardNumber.length > 0 && !cardNumber.replace(/\s/g, '').startsWith('4') ? '#ef4444' : 'rgba(0,0,0,0.05)'
                                                                        },
                                                                        required: true
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 300,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3",
                                                                        children: [
                                                                            cardNumber.replace(/\s/g, '').startsWith('4') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                                size: 18,
                                                                                className: "text-green-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                                lineNumber: 314,
                                                                                columnNumber: 73
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                                                size: 14,
                                                                                className: "opacity-40",
                                                                                style: {
                                                                                    color: 'var(--text-on-primary)'
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                                lineNumber: 315,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 313,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 299,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            cardNumber.length > 0 && !cardNumber.replace(/\s/g, '').startsWith('4') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] text-red-500 font-bold px-1",
                                                                children: "La tarjeta ingresada no es VISA. Por favor use una tarjeta válida."
                                                            }, void 0, false, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 319,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                        lineNumber: 294,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-2 gap-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-[11px] font-bold uppercase tracking-widest px-1 opacity-80",
                                                                        style: {
                                                                            color: 'var(--text-on-secondary)'
                                                                        },
                                                                        children: "Vencimiento"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 325,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        placeholder: "MM / YY",
                                                                        value: expiry,
                                                                        onChange: handleExpiryChange,
                                                                        className: "w-full px-6 py-4 rounded-xl font-black text-[16px] border focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-mono",
                                                                        style: {
                                                                            backgroundColor: 'var(--color-primary)',
                                                                            color: 'var(--text-on-primary)',
                                                                            borderColor: 'rgba(0,0,0,0.05)'
                                                                        },
                                                                        required: true
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 328,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 324,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-[11px] font-bold uppercase tracking-widest px-1 opacity-80",
                                                                        style: {
                                                                            color: 'var(--text-on-secondary)'
                                                                        },
                                                                        children: "CVC / CVV"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 339,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "password",
                                                                        placeholder: "•••",
                                                                        value: cvc,
                                                                        onChange: handleCvcChange,
                                                                        className: "w-full px-6 py-4 rounded-xl font-black text-[16px] border focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-mono",
                                                                        style: {
                                                                            backgroundColor: 'var(--color-primary)',
                                                                            color: 'var(--text-on-primary)',
                                                                            borderColor: 'rgba(0,0,0,0.05)'
                                                                        },
                                                                        required: true
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 342,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 338,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                        lineNumber: 323,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-[11px] font-bold uppercase tracking-widest px-1 opacity-80",
                                                                style: {
                                                                    color: 'var(--text-on-secondary)'
                                                                },
                                                                children: "Titular de la tarjeta"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 355,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                placeholder: "NOMBRE COMO APARECE EN LA TARJETA",
                                                                value: cardName,
                                                                onChange: (e)=>setCardName(e.target.value.toUpperCase()),
                                                                className: "w-full px-6 py-4 rounded-xl font-black text-[15px] border focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all uppercase",
                                                                style: {
                                                                    backgroundColor: 'var(--color-primary)',
                                                                    color: 'var(--text-on-primary)',
                                                                    borderColor: 'rgba(0,0,0,0.05)'
                                                                },
                                                                required: true
                                                            }, void 0, false, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 358,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                        lineNumber: 354,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                lineNumber: 293,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "pt-8 border-t",
                                                style: {
                                                    borderColor: 'rgba(0,0,0,0.05)'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-70",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 text-[11px] font-bold uppercase tracking-tighter",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                                    size: 14,
                                                                    className: "text-emerald-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                    lineNumber: 373,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Secure Payment"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                            lineNumber: 372,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 text-[11px] font-bold uppercase tracking-tighter",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                                    size: 14,
                                                                    className: "text-blue-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                    lineNumber: 376,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " SSL Encrypted"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                            lineNumber: 375,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 text-[11px] font-bold uppercase tracking-tighter",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                    size: 14,
                                                                    style: {
                                                                        color: 'var(--color-tertiary)'
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                    lineNumber: 379,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Verified by Visa"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                            lineNumber: 378,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                    lineNumber: 371,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                lineNumber: 370,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                        lineNumber: 165,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-3xl border p-8 sticky top-[100px] shadow-lg",
                                    style: {
                                        backgroundColor: 'var(--color-secondary)',
                                        color: 'var(--text-on-secondary)',
                                        borderColor: 'rgba(0,0,0,0.05)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-[18px] font-extrabold mb-6 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$546$2e$0_react$40$19$2e$2$2e$7$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                                                    size: 20,
                                                    style: {
                                                        color: 'var(--color-tertiary)'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                    lineNumber: 390,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Resumen de Compra"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                            lineNumber: 389,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4 mb-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between text-[14px]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium opacity-75",
                                                            children: "Producto:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                            lineNumber: 395,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-bold",
                                                            children: quote.productName
                                                        }, void 0, false, {
                                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                            lineNumber: 396,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                    lineNumber: 394,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between text-[14px]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium opacity-75",
                                                            children: "Cantidad:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                            lineNumber: 399,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-bold",
                                                            children: [
                                                                quote.quantity,
                                                                " uds."
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                            lineNumber: 400,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                    lineNumber: 398,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "border-t pt-6 flex flex-col gap-2",
                                                    style: {
                                                        borderColor: 'rgba(0,0,0,0.05)'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between text-[14px]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-medium opacity-75",
                                                                    children: "Subtotal:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                    lineNumber: 404,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-bold",
                                                                    children: [
                                                                        "S/ ",
                                                                        (quote.amount / 1.18).toFixed(2).toLocaleString()
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                    lineNumber: 405,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                            lineNumber: 403,
                                                            columnNumber: 20
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between text-[14px]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-medium opacity-75",
                                                                    children: "IGV (18%):"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                    lineNumber: 408,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-bold",
                                                                    children: [
                                                                        "S/ ",
                                                                        (quote.amount - quote.amount / 1.18).toFixed(2).toLocaleString()
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                    lineNumber: 409,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                            lineNumber: 407,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-4 flex justify-between items-end mb-8",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[12px] font-extrabold uppercase",
                                                                    children: "Total a Pagar"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                    lineNumber: 412,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[28px] font-extrabold leading-tight",
                                                                    children: [
                                                                        "S/ ",
                                                                        quote.amount.toLocaleString()
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                    lineNumber: 413,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                            lineNumber: 411,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                            form: "payment-form",
                                                            type: "submit",
                                                            variant: "primary",
                                                            fullWidth: true,
                                                            className: `py-5 text-[16px] font-black shadow-xl transition-all ${!isFormValid() ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`,
                                                            style: {
                                                                backgroundColor: 'var(--color-tertiary)',
                                                                color: 'var(--text-on-tertiary)'
                                                            },
                                                            disabled: isProcessing || !isFormValid(),
                                                            children: isProcessing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3 justify-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$7_$40$babel$2b$core$40$7$2e$2_27554004f431be4f267c657ce343daf6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Frontend$2f$Cliente$2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$40$2e$0_react_7ea1b4820433ad8864f2f384f03a8795$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                                                        animate: {
                                                                            rotate: 360
                                                                        },
                                                                        transition: {
                                                                            repeat: Infinity,
                                                                            duration: 1,
                                                                            ease: 'linear'
                                                                        },
                                                                        className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                        lineNumber: 429,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    "Validando..."
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                                lineNumber: 428,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)) : `Pagar con VISA`
                                                        }, void 0, false, {
                                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                            lineNumber: 418,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                                    lineNumber: 402,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                            lineNumber: 393,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                    lineNumber: 388,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                                lineNumber: 387,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Frontend/Cliente/src/views/Payment.tsx",
        lineNumber: 145,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
];

//# sourceMappingURL=Frontend_Cliente_src_views_Payment_tsx_02f2ap9._.js.map