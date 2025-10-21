import { pool } from '../../db';
import { User } from '../../generated-types/graphql';

export const findAll = async (): Promise<User[]> => {
  const result = await pool.query(`
      SELECT id, username, email, image, created_at AS "createdAt", email_verified AS "emailVerified", updated_at AS "updatedAt"
      FROM users
      ORDER BY username ASC
  `);

  return result.rows;
};

export const findById = async (userId: number): Promise<User | undefined> => {
  const result = await pool.query(`
      SELECT id, username, email, image, created_at AS "createdAt", email_verified AS "emailVerified", updated_at AS "updatedAt"
      FROM users
      WHERE id = $1
      ORDER BY username ASC
  `, [userId]);

  return result.rows[0];
};

export const findByQuery = async (query: string): Promise<User[]> => {
  const result = await pool.query(`
      SELECT id, username, email, image, created_at AS "createdAt", email_verified AS "emailVerified", updated_at AS "updatedAt"
      FROM users
      WHERE username ILIKE $1
         OR email ILIKE $1
      ORDER BY username ASC
  `, [`%${query}%`]);

  return result.rows;
};
