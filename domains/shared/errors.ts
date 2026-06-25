const DEFAULT_ERROR_MESSAGE = 'Ocurrió un error. Inténtalo nuevamente.';

const ERROR_TRANSLATIONS: Array<[RegExp, string]> = [
  [/customer does not belong to this store/i, 'El cliente no pertenece a esta tienda.'],
  [/invalid credentials|bad credentials/i, 'Credenciales inválidas.'],
  [/unauthorized/i, 'No tienes autorización para realizar esta acción.'],
  [/forbidden/i, 'No tienes permisos para realizar esta acción.'],
  [/not found/i, 'No se encontró el recurso solicitado.'],
  [/network error|failed to fetch/i, 'No se pudo conectar con el servidor.'],
  [/internal server error/i, 'Ocurrió un error interno. Inténtalo nuevamente.'],
  [/cart is empty/i, 'El carrito está vacío.'],
  [/cart must have at least one item/i, 'El carrito debe tener al menos un producto para cotizar.'],
  [/cart already has a (pending )?quotation/i, 'Este carrito ya fue enviado como cotización. Se ha creado un carrito nuevo para tus próximas compras.'],
  [/product not found/i, 'Producto no encontrado.'],
  [/store not found/i, 'Tienda no encontrada.'],
  [/quote not found|quotation not found/i, 'Cotización no encontrada.'],
  [/email.*already.*(exists|registered)|correo.*registrado/i, 'El correo ya está registrado.'],
  [/password.*required/i, 'La contraseña es obligatoria.'],
  [/email.*required/i, 'El correo electrónico es obligatorio.'],
  [/invalid.*email/i, 'El correo electrónico no es válido.'],
  [/validation/i, 'Revisa los datos ingresados.'],
  // Errores de pago
  [/order already has a payment receipt/i, 'Este pedido ya fue pagado anteriormente.'],
  [/only confirmed orders can be paid/i, 'Este pedido no está disponible para pago.'],
  [/payment declined.*card rejected/i, 'Pago declinado. Tu tarjeta fue rechazada por el banco emisor.'],
  [/card number must have 16 digits/i, 'El número de tarjeta debe tener 16 dígitos.'],
  [/card number must contain only digits/i, 'El número de tarjeta solo debe contener dígitos.'],
  [/card holder name is required/i, 'El nombre del titular es obligatorio.'],
  [/cvv must have 3 digits/i, 'El CVV debe tener 3 dígitos.'],
  [/expiry date must be in mm\/yy format/i, 'La fecha de vencimiento debe tener formato MM/AA.'],
  [/card has expired/i, 'La tarjeta está vencida.'],
  [/payment method is required/i, 'El método de pago es obligatorio.'],
  [/order cannot be (found|paid|processed)/i, 'No se pudo procesar el pago del pedido.'],
];

export function translateErrorMessage(message: unknown, fallback = DEFAULT_ERROR_MESSAGE): string {
  const text = String(message || '').trim();
  if (!text) return fallback;

  const known = ERROR_TRANSLATIONS.find(([pattern]) => pattern.test(text));
  if (known) return known[1];

  if (/^error\s+\d{3}$/i.test(text) || /^error\s+\d{3}:/i.test(text)) {
    return fallback;
  }

  const looksTechnical = /exception|stack trace|traceback|java\.|org\.|sql|syntaxerror|typeerror|referenceerror/i.test(text);
  if (looksTechnical) return fallback;

  return text;
}

export function messageFromError(error: unknown, fallback = DEFAULT_ERROR_MESSAGE): string {
  if (error instanceof Error) return translateErrorMessage(error.message, fallback);
  return translateErrorMessage(error, fallback);
}
