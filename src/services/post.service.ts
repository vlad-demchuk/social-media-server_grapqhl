import { pool } from "../db.js";
import { CreatePostInput } from "../types.js";

export const getAll = async () => {
  const result = await pool.query(`
    SELECT 
      posts.id, 
      posts.content, 
      posts.created_at AS "createdAt", 
      users.username,
      COUNT(DISTINCT likes.id) AS "likesCount",
      COUNT(DISTINCT c.id) AS "commentsCount"
    FROM posts
    JOIN users ON users.id = posts.user_id
    LEFT JOIN likes ON likes.post_id = posts.id
    LEFT JOIN comments c ON c.post_id = posts.id
    GROUP BY posts.id, users.username
    ORDER BY posts.created_at DESC;
  `);

  console.log(result.rows);
  return result.rows;
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
