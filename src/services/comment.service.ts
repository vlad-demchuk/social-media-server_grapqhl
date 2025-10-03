import { Comment, CreateCommentInput } from '../types';
import { pool } from '../db/db';

export const getByPostId = async (postId: number) => {
  const result = await pool.query(
    `
      SELECT 
        comments.id,
        comments.content,
        comments.created_at AS "createdAt",
        json_build_object(
          'id', users.id,
          'username', users.username,
          'email', users.email,
          'image', users.image,
          'createdAt', users.created_at,
          'emailVerified', users.email_verified,
          'updatedAt', users.updated_at
        ) AS author
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
}: CreateCommentInput & { userId: number }): Promise<Comment> => {
  const result = await pool.query(
    `
      WITH inserted AS (
        INSERT INTO comments (content, user_id, post_id)
        VALUES ($1, $2, $3)
        RETURNING id, content, created_at, user_id
      )
      SELECT 
        i.id,
        i.content,
        i.created_at AS "createdAt",
        json_build_object(
          'id', u.id,
          'username', u.username,
          'email', u.email,
          'image', u.image,
          'createdAt', u.created_at,
          'emailVerified', u.email_verified,
          'updatedAt', u.updated_at
        ) AS author
      FROM inserted i
      JOIN users u ON u.id = i.user_id
    `,
    [content, userId, postId],
  );

  return result.rows[0];
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



