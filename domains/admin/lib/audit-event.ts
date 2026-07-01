function resultLabel(ok: boolean, success: string, failure: string): string {
  return ok ? success : failure;
}

function fallbackAction(method: string, statusCode: number): string {
  const ok = statusCode < 400;
  const action = (() => {
    if (method === 'GET') return 'Consulta de información';
    if (method === 'POST') return 'Registro de información';
    if (method === 'PUT') return 'Actualización de información';
    if (method === 'PATCH') return 'Cambio de estado';
    if (method === 'DELETE') return 'Eliminación de información';
    return 'Acción realizada';
  })();

  return ok ? action : `Error en ${action.toLowerCase()}`;
}

export function auditEventLabel(method: string, endpoint: string, statusCode: number): string {
  const httpMethod = method.toUpperCase();
  const e = endpoint.toLowerCase();
  const ok = statusCode < 400;

  if (e.includes('/auth/login')) return resultLabel(ok, 'Inicio de sesión', 'Inicio de sesión fallido');
  if (e.includes('/auth/logout')) return 'Cierre de sesión';
  if (e.includes('/auth/password/forgot')) return resultLabel(ok, 'Solicitud de recuperación de contraseña', 'Error al solicitar recuperación de contraseña');
  if (e.includes('/auth/password/reset')) return resultLabel(ok, 'Contraseña restablecida', 'Error al restablecer contraseña');

  if (e.includes('/admin/stores/metrics')) return resultLabel(ok, 'Consulta de métricas de tiendas', 'Error al consultar métricas de tiendas');
  if (e.includes('/admin/audit')) return resultLabel(ok, 'Consulta de auditoría', 'Error al consultar auditoría');
  if (e.includes('/admin/bulk/upload')) return resultLabel(ok, 'Carga masiva ejecutada', 'Error en carga masiva');
  if (e.includes('/admin/categories')) {
    if (e.includes('/deactivate')) return resultLabel(ok, 'Categoría desactivada', 'Error al desactivar categoría');
    if (e.includes('/reactivate')) return resultLabel(ok, 'Categoría reactivada', 'Error al reactivar categoría');
    if (httpMethod === 'POST') return resultLabel(ok, 'Categoría creada', 'Error al crear categoría');
    if (httpMethod === 'PUT') return resultLabel(ok, 'Categoría actualizada', 'Error al actualizar categoría');
    if (httpMethod === 'DELETE') return resultLabel(ok, 'Categoría eliminada', 'Error al eliminar categoría');
    return resultLabel(ok, 'Consulta de categorías', 'Error al consultar categorías');
  }
  if (e.includes('/admin/stores')) {
    if (e.includes('/suspend')) return resultLabel(ok, 'Tienda suspendida', 'Error al suspender tienda');
    if (e.includes('/reactivate')) return resultLabel(ok, 'Tienda reactivada', 'Error al reactivar tienda');
    if (e.includes('/deactivate')) return resultLabel(ok, 'Tienda desactivada', 'Error al desactivar tienda');
    if (httpMethod === 'POST') return resultLabel(ok, 'Tienda registrada', 'Error al registrar tienda');
    if (httpMethod === 'PUT') return resultLabel(ok, 'Tienda editada', 'Error al editar tienda');
    return resultLabel(ok, 'Consulta de tiendas', 'Error al consultar tiendas');
  }
  if (e.includes('/admin/users')) {
    if (e.includes('/deactivate')) return resultLabel(ok, 'Usuario desactivado', 'Error al desactivar usuario');
    if (e.includes('/reactivate')) return resultLabel(ok, 'Usuario reactivado', 'Error al reactivar usuario');
    if (httpMethod === 'POST') return resultLabel(ok, 'Usuario creado', 'Error al crear usuario');
    if (httpMethod === 'PUT') return resultLabel(ok, 'Usuario actualizado', 'Error al actualizar usuario');
    return resultLabel(ok, 'Consulta de usuarios', 'Error al consultar usuarios');
  }

  if (e.includes('/merchant/products/images')) return resultLabel(ok, 'Imagen de producto cargada', 'Error al cargar imagen de producto');
  if (e.includes('/merchant/products')) {
    if (e.includes('/active')) return resultLabel(ok, 'Estado de producto actualizado', 'Error al actualizar estado de producto');
    if (httpMethod === 'POST') return resultLabel(ok, 'Producto creado', 'Error al crear producto');
    if (httpMethod === 'PUT') return resultLabel(ok, 'Producto actualizado', 'Error al actualizar producto');
    if (httpMethod === 'DELETE') return resultLabel(ok, 'Producto eliminado', 'Error al eliminar producto');
    return resultLabel(ok, 'Consulta de productos', 'Error al consultar productos');
  }
  if (e.includes('/merchant/discounts')) {
    if (httpMethod === 'POST') return resultLabel(ok, 'Descuento creado', 'Error al crear descuento');
    if (httpMethod === 'PUT') return resultLabel(ok, 'Descuento actualizado', 'Error al actualizar descuento');
    if (httpMethod === 'DELETE') return resultLabel(ok, 'Descuento eliminado', 'Error al eliminar descuento');
    return resultLabel(ok, 'Consulta de descuentos', 'Error al consultar descuentos');
  }
  if (e.includes('/merchant/designs')) {
    if (e.includes('/approve')) return resultLabel(ok, 'Diseño aprobado', 'Error al aprobar diseño');
    if (e.includes('/reject')) return resultLabel(ok, 'Diseño rechazado', 'Error al rechazar diseño');
    return resultLabel(ok, 'Consulta de diseños', 'Error al consultar diseños');
  }
  if (e.includes('/merchant/quotations')) {
    if (e.includes('/respond')) return resultLabel(ok, 'Cotización respondida', 'Error al responder cotización');
    return resultLabel(ok, 'Consulta de cotizaciones de tienda', 'Error al consultar cotizaciones de tienda');
  }
  if (e.includes('/merchant/orders')) {
    if (e.includes('/advance')) return resultLabel(ok, 'Pedido avanzado de etapa', 'Error al avanzar pedido');
    if (e.includes('/cancel')) return resultLabel(ok, 'Pedido cancelado', 'Error al cancelar pedido');
    if (e.includes('/ship')) return resultLabel(ok, 'Pedido marcado como enviado', 'Error al marcar pedido como enviado');
    if (e.includes('/status')) return resultLabel(ok, 'Estado de pedido actualizado', 'Error al actualizar estado de pedido');
    return resultLabel(ok, 'Consulta de pedidos de tienda', 'Error al consultar pedidos de tienda');
  }
  if (e.includes('/merchant/profile/password')) return resultLabel(ok, 'Contraseña de comerciante actualizada', 'Error al actualizar contraseña de comerciante');
  if (e.includes('/merchant/profile')) return resultLabel(ok, 'Perfil de comerciante actualizado', 'Error al actualizar perfil de comerciante');
  if (e.includes('/merchant/stores/logo')) return resultLabel(ok, 'Logo de tienda cargado', 'Error al cargar logo de tienda');
  if (e.includes('/merchant/stores')) {
    if (httpMethod === 'POST') return resultLabel(ok, 'Tienda de comerciante creada', 'Error al crear tienda de comerciante');
    if (httpMethod === 'PUT') return resultLabel(ok, 'Tienda de comerciante actualizada', 'Error al actualizar tienda de comerciante');
    if (httpMethod === 'DELETE') return resultLabel(ok, 'Tienda de comerciante eliminada', 'Error al eliminar tienda de comerciante');
  }

  if (e.includes('/customers/register')) return resultLabel(ok, 'Cliente registrado en tienda', 'Error al registrar cliente en tienda');
  if (e.includes('/cart/items') && e.includes('/design')) return resultLabel(ok, 'Diseño de producto actualizado en cotización', 'Error al actualizar diseño de producto');
  if (e.includes('/cart/items')) {
    if (httpMethod === 'POST') return resultLabel(ok, 'Producto agregado al detalle de cotización', 'Error al agregar producto al detalle de cotización');
    if (httpMethod === 'PUT') return resultLabel(ok, 'Producto actualizado en detalle de cotización', 'Error al actualizar producto en detalle de cotización');
    if (httpMethod === 'DELETE') return resultLabel(ok, 'Producto retirado del detalle de cotización', 'Error al retirar producto del detalle de cotización');
  }
  if (e.includes('/quotations')) {
    if (httpMethod === 'POST') return resultLabel(ok, 'Cotización solicitada', 'Error al solicitar cotización');
    return resultLabel(ok, 'Consulta de cotización', 'Error al consultar cotización');
  }
  if (e.includes('/orders') && e.includes('/payment')) return resultLabel(ok, 'Pago registrado', 'Error al registrar pago');
  if (e.includes('/orders')) return resultLabel(ok, 'Consulta de pedidos', 'Error al consultar pedidos');

  return fallbackAction(httpMethod, statusCode);
}
