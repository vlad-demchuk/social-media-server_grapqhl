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

export const getConversationMessages = async (conversationId: number) => {
  const result = await pool.query(`
      SELECT m.id,
             m.conversation_id AS "conversationId",
             m.content,
             m.created_at      AS "createdAt",
             m.updated_at      AS "updatedAt",
             json_build_object(
                     'id', u.id,
                     'username', u.username,
                     'image', u.image
             )                 AS sender
      FROM messages m
               LEFT JOIN users u ON u.id = m.sender_id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC 
      -- LIMIT $2 OFFSET $3;
  `, [conversationId]);

  return result.rows;
};
