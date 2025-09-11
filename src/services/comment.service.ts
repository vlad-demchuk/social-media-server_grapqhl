import { CreateCommentInput } from '../types';
import { pool } from '../db';

export const getByPostId = async (postId: number) => {
  const result = await pool.query(
    `
      SELECT 
        comments.id,
        comments.content,
        comments.created_at AS "createdAt",
        users.username
      FROM comments
      JOIN users ON users.id = comments.user_id
      WHERE comments.post_id = $1
      ORDER BY comments.created_at ASC
    `,
    [postId],
  );

  return result.rows;
};

export const create = async ({
  content,
  userId,
  postId,
}: CreateCommentInput & { userId: number }) => {
  const result = await pool.query(
    `
      INSERT INTO comments (content, user_id, post_id)
      VALUES ($1, $2, $3)
      RETURNING id, content, created_at AS "createdAt", 
        (SELECT username FROM users WHERE users.id = $2) AS username
    `,
    [content, userId, postId],
  );

  const inserted = result.rows[0];

  return {
    id: inserted.id,
    content: inserted.content,
    createdAt: inserted.createdAt,
    username: inserted.username,
  };
};

export const remove = async (id: number) => {
  const result = await pool.query(
    `
    DELETE FROM comments
    WHERE id = $1
    RETURNING id
  `,
    [id],
  );

  return result.rowCount > 0;
};



