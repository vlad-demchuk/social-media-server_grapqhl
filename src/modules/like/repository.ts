import { pool } from '../../db';

export const insert = async (userId: number, postId: number): Promise<void> => {
  await pool.query(
    `
    INSERT INTO likes (user_id, post_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, post_id) DO NOTHING
    `,
    [userId, postId],
  );
};

export const deleteByUserAndPost = async (userId: number, postId: number): Promise<void> => {
  await pool.query(
    `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId],
  );
};
