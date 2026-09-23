import { Router } from 'express';
import { credencialesValidas, requiereAdmin } from '../middleware/auth.js';
import { actualizar, crear, eliminar, listarTodos, obtener } from '../db/materiales.js';
import { validarMaterial } from '../validacion.js';

export const admin = Router();

admin.get('/login', (req, res) => {
  res.render('admin/login', { error: null });
});

admin.post('/login', (req, res) => {
  const { usuario = '', password = '' } = req.body;
  if (!credencialesValidas(usuario, password)) {
    return res.status(401).render('admin/login', { error: 'Credenciales invalidas' });
  }
  req.session.admin = usuario;
  res.redirect('/admin');
});

admin.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

admin.use(requiereAdmin);

admin.get('/', async (req, res, next) => {
  try {
    res.render('admin/lista', { materiales: await listarTodos() });
  } catch (err) {
    next(err);
  }
});

admin.get('/nuevo', (req, res) => {
  res.render('admin/formulario', {
    material: { disponible: 1 },
    errores: [],
    accion: '/admin/nuevo',
    titulo: 'Nuevo material'
  });
});

admin.post('/nuevo', async (req, res, next) => {
  const { errores, valores } = validarMaterial(req.body);
  if (errores.length) {
    return res.status(400).render('admin/formulario', {
      material: { ...req.body, disponible: valores.disponible ? 1 : 0 },
      errores,
      accion: '/admin/nuevo',
      titulo: 'Nuevo material'
    });
  }
  try {
    await crear(valores);
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
});

admin.get('/:id/editar', async (req, res, next) => {
  try {
    const material = await obtener(Number(req.params.id));
    if (!material) return res.status(404).render('404');
    res.render('admin/formulario', {
      material,
      errores: [],
      accion: `/admin/${material.id}/editar`,
      titulo: 'Editar material'
    });
  } catch (err) {
    next(err);
  }
});

admin.post('/:id/editar', async (req, res, next) => {
  const id = Number(req.params.id);
  const { errores, valores } = validarMaterial(req.body);
  if (errores.length) {
    return res.status(400).render('admin/formulario', {
      material: { ...req.body, id, disponible: valores.disponible ? 1 : 0 },
      errores,
      accion: `/admin/${id}/editar`,
      titulo: 'Editar material'
    });
  }
  try {
    await actualizar(id, valores);
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
});

admin.post('/:id/eliminar', async (req, res, next) => {
  try {
    await eliminar(Number(req.params.id));
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
});
