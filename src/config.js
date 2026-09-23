import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT ?? 3000),
  db: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'catalogo'
  },
  sessionSecret: process.env.SESSION_SECRET ?? 'dev-secret',
  admin: {
    user: process.env.ADMIN_USER ?? 'admin',
    passwordHash: process.env.ADMIN_PASSWORD_HASH ?? '',
    password: process.env.ADMIN_PASSWORD ?? ''
  }
};
