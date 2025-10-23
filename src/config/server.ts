export const config = {
  port: process.env.PORT || 4000,
  host: process.env.PORT ? '0.0.0.0' : '127.0.0.1',
  frontendUrl: process.env.FRONTEND_URL || 'https://social-media-nextjs-two.vercel.app',
  cors: {
    origins: [
      process.env.FRONTEND_URL || 'https://social-media-nextjs-two.vercel.app',
      'http://localhost:3000',
      'https://studio.apollographql.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Apollo-Require-Preflight'],
  },
};
