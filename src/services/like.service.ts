import { pool } from "../db.js";
import { getById as getPostById } from "./post.service.js";

export const likePost = async (userId: number, postId: number) => {
  await pool.query(
    `
    INSERT INTO likes (user_id, post_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, post_id) DO NOTHING
    `,
    [userId, postId]
  );

  const post = await getPostById(postId);

  return post;
};

export const unlikePost = async (userId: number, postId: number) => {
  await pool.query(
    `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );

  const post = await getPostById(postId);

  return post;
};
