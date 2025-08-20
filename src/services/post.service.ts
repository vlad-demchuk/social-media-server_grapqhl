import { pool } from "../db";
import { CreatePostInput } from "../types";

export const getAll = async () => {
  const result = await pool.query(
    `
    SELECT p.id, p.content, p.created_at AS "createdAt", u.username,
           COUNT(DISTINCT l.id) AS "likesCount",
           COUNT(DISTINCT c.id) AS "commentsCount"
    FROM posts p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN likes l ON l.post_id = p.id
    LEFT JOIN comments c ON c.post_id = p.id
    GROUP BY p.id, u.username
    ORDER BY p.created_at DESC;
  `
  );

  return result.rows;
};

export const getById = async (postId: number) => {
  const result = await pool.query(
    `
    SELECT p.id, p.content, p.created_at AS "createdAt", u.username,
           COUNT(DISTINCT l.id) AS "likesCount",
           COUNT(DISTINCT c.id) AS "commentsCount"
    FROM posts p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN likes l ON l.post_id = p.id
    LEFT JOIN comments c ON c.post_id = p.id
    WHERE p.id = $1
    GROUP BY p.id, u.username
  `,
    [postId]
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
    VALUES ($1, $2)
    RETURNING id, content, created_at, 
      (SELECT username FROM users WHERE users.id = posts.user_id) AS username
    `,
    [userId, content]
  );

  const inserted = result.rows[0];

  return {
    id: inserted.id,
    content: inserted.content,
    createdAt: inserted.createdAt,
    username: inserted.username,
    likesCount: 0,
    commentsCount: 0,
  };
};

export const remove = async (id: number) => {
  const result = await pool.query(
    `
    DELETE FROM posts
    WHERE id = $1
    RETURNING id
  `,
    [id]
  );

  return result.rowCount > 0;
};
