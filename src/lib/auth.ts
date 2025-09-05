import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import 'dotenv/config';
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  // cookies: {
  //   sameSite: 'none',   // allow cross-site
  //   secure: false,      // allow localhost http
  // },
  appName: 'Social Media',
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ['http://localhost:3000'],
  plugins: [nextCookies()],
  advanced: {
    allowedOrigins: ['http://localhost:3000'],
    database: {
      useNumberId: true,
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

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user
