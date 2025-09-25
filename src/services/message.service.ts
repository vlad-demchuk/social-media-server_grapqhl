import { pool } from '../db/db';
import { Message } from '../types';

export const getConversationMessages = async (conversationId: number) => {
  const result = await pool.query(
    `
        SELECT m.id,
               m.conversation_id AS "conversationId",
               m.content,
               m.created_at      AS "createdAt",
               m.updated_at      AS "updatedAt",
               json_build_object(
                       'id', u.id,
                       'username', u.username,
                       'email', u.email,
                       'image', u.image,
                       'createdAt', u.created_at,
                       'emailVerified', u.email_verified,
                       'updatedAt', u.updated_at
               )                 AS sender
        FROM messages m
                 LEFT JOIN users u ON u.id = m.sender_id
        WHERE m.conversation_id = $1
        ORDER BY m.created_at ASC
        -- LIMIT $2 OFFSET $3;
    `,
    [conversationId],
  );

  return result.rows;
};

export const create = async ({
  conversationId,
  senderId,
  content,
}: {
  conversationId: number;
  senderId: number;
  content: string;
}): Promise<Message> => {
  const result = await pool.query(
    `
        WITH inserted AS (
        INSERT
        INTO messages (conversation_id, sender_id, content)
        VALUES ($1, $2, $3)
            RETURNING id, conversation_id, sender_id, content, created_at, updated_at
            )
        SELECT i.id,
               i.conversation_id AS "conversationId",
               i.content,
               i.created_at      AS "createdAt",
               i.updated_at      AS "updatedAt",
               json_build_object(
                       'id', u.id,
                       'username', u.username,
                       'email', u.email,
                       'image', u.image,
                       'createdAt', u.created_at,
                       'emailVerified', u.email_verified,
                       'updatedAt', u.updated_at
               )                 AS sender
        FROM inserted i
                 JOIN users u ON u.id = i.sender_id
    `,
    [conversationId, senderId, content],
  );

  return result.rows[0];
};

