import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import 'dotenv/config';

export const auth = betterAuth({
  appName: 'Social Media',
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ['http://localhost:3000', process.env.FRONTEND_URL, 'https://studio.apollographql.com'],
  advanced: {
    allowedOrigins: ['http://localhost:3000', process.env.FRONTEND_URL, 'https://studio.apollographql.com'],
    database: {
      useNumberId: true,
    },
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
      path: '/',
    },
    useSecureCookies: true,
  },
  user: {
    modelName: 'users',
    fields: {
      name: 'username',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      emailVerified: 'email_verified',
    },
  },
  session: {
    modelName: 'sessions',
    fields: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      expiresAt: 'expires_at',
      ipAddress: 'ip_address',
      userAgent: 'user_agent',
      userId: 'user_id'
    },
  },
  account: {
    modelName: 'accounts',
    fields: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      accountId: 'account_id',
      providerId: 'provider_id',
      accessToken: 'access_token',
      accessTokenExpiresAt: 'access_token_expires_at',
      refreshToken: 'refresh_token',
      refreshTokenExpiresAt: 'refresh_token_expires_at',
      idToken: 'id_token',
      userId: 'user_id',
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
