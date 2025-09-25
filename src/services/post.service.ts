import { pool } from '../db/db';
import { CreatePostInput } from '../types';

export const getAll = async (currentUserId: number) => {
  const result = await pool.query(
    `
        SELECT p.id,
               p.content,
               p.created_at                   AS "createdAt",
               json_build_object(
                       'id', u.id,
                       'username', u.username,
                       'email', u.email,
                       'image', u.image,
                       'createdAt', u.created_at,
                       'emailVerified', u.email_verified,
                       'updatedAt', u.updated_at
               )                              AS owner,
               COUNT(DISTINCT l.id)           AS "likesCount",
               COUNT(DISTINCT c.id)           AS "commentsCount",
               EXISTS (SELECT 1
                       FROM likes l2
                       WHERE l2.post_id = p.id
                         AND l2.user_id = $1) AS "isLiked"
        FROM posts p
                 JOIN users u ON u.id = p.user_id
                 LEFT JOIN likes l ON l.post_id = p.id
                 LEFT JOIN comments c ON c.post_id = p.id
        GROUP BY p.id, u.id
        ORDER BY p.created_at DESC;
    `, [currentUserId]);

  return result.rows;
};

export const getPostsByUserName = async (currentUserId: number, userName: string) => {
  const result = await pool.query(
    `
        SELECT p.id,
               p.content,
               p.created_at                   AS "createdAt",
               json_build_object(
                       'id', u.id,
                       'username', u.username,
                       'email', u.email,
                       'image', u.image,
                       'createdAt', u.created_at,
                       'emailVerified', u.email_verified,
                       'updatedAt', u.updated_at
               )                              AS owner,
               COUNT(DISTINCT l.id)           AS "likesCount",
               COUNT(DISTINCT c.id)           AS "commentsCount",
               EXISTS (SELECT 1
                       FROM likes l2
                       WHERE l2.post_id = p.id
                         AND l2.user_id = $1) AS "isLiked"
        FROM posts p
                 JOIN users u ON u.id = p.user_id
                 LEFT JOIN likes l ON l.post_id = p.id
                 LEFT JOIN comments c ON c.post_id = p.id
        WHERE u.username = $2
        GROUP BY p.id, u.id
        ORDER BY p.created_at DESC;
    `, [currentUserId, userName]);

  return result.rows;
};

export const getById = async (userId: number, postId: number) => {
  const result = await pool.query(
    `
        SELECT p.id,
               p.content,
               p.created_at                   AS "createdAt",
               json_build_object(
                       'id', u.id,
                       'username', u.username,
                       'email', u.email,
                       'image', u.image,
                       'createdAt', u.created_at,
                       'emailVerified', u.email_verified,
                       'updatedAt', u.updated_at
               )                              AS owner,
               COUNT(DISTINCT l.id)           AS "likesCount",
               COUNT(DISTINCT c.id)           AS "commentsCount",
               EXISTS (SELECT 1
                       FROM likes l2
                       WHERE l2.post_id = p.id
                         AND l2.user_id = $1) AS "isLiked"
        FROM posts p
                 JOIN users u ON u.id = p.user_id
                 LEFT JOIN likes l ON l.post_id = p.id
                 LEFT JOIN comments c ON c.post_id = p.id
        WHERE p.id = $2
        GROUP BY p.id, u.id;
    `,
    [userId, postId],
  );

  return result.rows[0];
};

export const create = async ({
  content,
  userId,
}: CreatePostInput & { userId: number }) => {
  const result = await pool.query(
    `
        INSERT INTO posts (user_id, content)
        VALUES ($1, $2) RETURNING 
        posts.id,
        posts.content,
        posts.created_at AS "createdAt",
        (SELECT json_build_object(
          'id', u.id,
          'username', u.username,
          'email', u.email,
          'image', u.image,
          'createdAt', u.created_at,
          'emailVerified', u.email_verified,
          'updatedAt', u.updated_at
  )
  FROM users u
  WHERE u.id = posts.user_id) AS owner;
    `,
    [userId, content],
  );

  const row = result.rows[0];

  return {
    id: row.id,
    content: row.content,
    createdAt: row.createdAt,
    owner: row.owner,
    likesCount: 0,
    commentsCount: 0,
    isLiked: false,
  };
};

export const remove = async (id: number) => {
  const result = await pool.query(
    `
        DELETE
        FROM posts
        WHERE id = $1 RETURNING id
    `,
    [id],
  );

  return result.rowCount > 0;
};
