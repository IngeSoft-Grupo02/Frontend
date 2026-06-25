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
  [/product not found/i, 'Producto no encontrado.'],
  [/store not found/i, 'Tienda no encontrada.'],
  [/quote not found|quotation not found/i, 'Cotización no encontrada.'],
  [/email.*already.*(exists|registered)|correo.*registrado/i, 'El correo ya está registrado.'],
  [/password.*required/i, 'La contraseña es obligatoria.'],
  [/email.*required/i, 'El correo electrónico es obligatorio.'],
  [/invalid.*email/i, 'El correo electrónico no es válido.'],
  [/validation/i, 'Revisa los datos ingresados.'],
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
