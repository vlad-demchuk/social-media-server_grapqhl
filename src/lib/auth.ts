import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import 'dotenv/config';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  appName: 'Social Media',
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
  trustedOrigins: ['http://localhost:3000'],
  advanced: {
    allowedOrigins: ['http://localhost:3000'],
    database: {
      useNumberId: true,
    },
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    },
  },
  user: {
    modelName: 'users',
    fields: {
      name: 'username',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
    modelName: 'sessions',
    fields: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      expiresAt: 'expires_at',
    },
  },
  account: {
    modelName: 'accounts',
    fields: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  verification: {
    modelName: 'verifications',
    fields: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      expiresAt: 'expires_at',
    },
  },
});

export type Session = Omit<typeof auth.$Infer.Session.session, 'id' | 'userId'> & {
  id: number;
  userId: number;
};

export type User = Omit<typeof auth.$Infer.Session.user, 'id'> & {
  id: number;
};
