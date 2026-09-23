import express from 'express';
import session from 'express-session';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { publico } from './routes/publico.js';
import { admin } from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function crearApp() {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', 'views'));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(
    session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 }
    })
  );

  app.use((req, res, next) => {
    res.locals.admin = req.session?.admin ?? null;
    next();
  });

  app.use('/', publico);
  app.use('/admin', admin);

  app.use((req, res) => res.status(404).render('404'));

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('500');
  });

  return app;
}
