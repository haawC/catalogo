import { Router } from 'express';
import { listarAleatorios, obtener } from '../db/materiales.js';

export const publico = Router();

publico.get('/', async (req, res, next) => {
  try {
    res.render('index', { materiales: await listarAleatorios(6) });
  } catch (err) {
    next(err);
  }
});

publico.get('/api/materiales/aleatorios', async (req, res, next) => {
  try {
    res.json(await listarAleatorios(6));
  } catch (err) {
    next(err);
  }
});

publico.get('/material/:id', async (req, res, next) => {
  try {
    const material = await obtener(Number(req.params.id));
    if (!material) return res.status(404).render('404');
    res.render('material', { material });
  } catch (err) {
    next(err);
  }
});
