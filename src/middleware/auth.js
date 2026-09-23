import bcrypt from 'bcryptjs';
import { config } from '../config.js';

export function requiereAdmin(req, res, next) {
  if (req.session?.admin) return next();
  return res.redirect('/admin/login');
}

export function credencialesValidas(usuario, password) {
  if (usuario !== config.admin.user) return false;
  if (config.admin.passwordHash) {
    return bcrypt.compareSync(password, config.admin.passwordHash);
  }
  return Boolean(config.admin.password) && password === config.admin.password;
}
