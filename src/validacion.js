export function validarMaterial(body) {
  const errores = [];
  const nombre = (body.nombre ?? '').trim();
  const descripcion = (body.descripcion ?? '').trim();
  const categoria = (body.categoria ?? '').trim();
  const imagenUrl = (body.imagen_url ?? '').trim();

  if (nombre.length < 3 || nombre.length > 150) {
    errores.push('El nombre debe tener entre 3 y 150 caracteres.');
  }
  if (descripcion.length > 2000) {
    errores.push('La descripcion no puede superar 2000 caracteres.');
  }
  if (categoria.length > 80) {
    errores.push('La categoria no puede superar 80 caracteres.');
  }
  if (imagenUrl && !/^https?:\/\//i.test(imagenUrl)) {
    errores.push('La URL de imagen debe empezar por http:// o https://');
  }

  const disponible = body.disponible === 'on' || body.disponible === true || body.disponible === '1';
  return { errores, valores: { nombre, descripcion, categoria, imagenUrl, disponible } };
}
