import { pool } from '../db/db';

// TODO: Implement pagination/infinite scrolling

export const getAll = async (currentUserId: number) => {
  const result = await pool.query(`
   WITH chat_list AS (
    SELECT
        c.id AS id,
        c.type,
        c.name,
        c.created_at AS "createdAt",

        -- participants (including current user for now)
        json_agg(
            json_build_object(
                'id', u.id,
                'username', u.username,
                'image', u.image
            )
        ) FILTER (WHERE u.id IS NOT NULL AND (c.type != 'direct' OR u.id != $1)) AS participants,

        -- lastMessage as JSON
        (
            SELECT json_build_object(
                'id', m.id,
                'content', m.content,
                'createdAt', m.created_at,
                'updatedAt', m.updated_at,
                'sender', json_build_object(
                    'id', sender.id,
                    'username', sender.username,
                    'image', sender.image
                )
            )
            FROM messages m
            LEFT JOIN users sender ON sender.id = m.sender_id
            WHERE m.conversation_id = c.id
            ORDER BY m.created_at DESC
            LIMIT 1
        ) AS "lastMessage"
    FROM conversations c
    JOIN conversation_participants cp ON cp.conversation_id = c.id
    JOIN users u ON u.id = cp.user_id
    WHERE c.id IN (
        SELECT conversation_id
        FROM conversation_participants
        WHERE user_id = $1
    )
    GROUP BY c.id
)
SELECT *
FROM chat_list
ORDER BY
    ("lastMessage"->>'createdAt')::timestamptz DESC NULLS LAST,
    "createdAt" DESC;
    `, [currentUserId]);

  return result.rows;
}

export const createDirect = async (currentUserId: number, secondUserId: number) => {
  // Check if conversation exists
  const existing = await pool.query(
    `
        SELECT c.id
        FROM conversations c
                 JOIN conversation_participants cp1 ON cp1.conversation_id = c.id
                 JOIN conversation_participants cp2 ON cp2.conversation_id = c.id
        WHERE c.type = 'direct'
          AND cp1.user_id = $1
          AND cp2.user_id = $2 LIMIT 1
    `,
    [currentUserId, secondUserId],
  );

  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }

  // Create new
  const conversationRes = await pool.query(
    `INSERT INTO conversations (type)
     VALUES ('direct') RETURNING id`,
  );

  const conversationId = conversationRes.rows[0].id;

  await pool.query(
    `INSERT INTO conversation_participants (conversation_id, user_id)
     VALUES ($1, $2),
            ($1, $3)`,
    [conversationId, currentUserId, secondUserId],
  );

  return conversationId;
};

export const isUserInChat = async (userId: number, conversationId: number) => {
  const result = await pool.query(`
      SELECT 1
      FROM conversation_participants
      WHERE user_id = $1
        AND conversation_id = $2 LIMIT 1;
  `, [userId, conversationId]);

  return result.rowCount > 0
}
