import { pool } from '../db/db';
import { Conversation } from '../types';

// TODO: Implement pagination/infinite scrolling

export const getAll = async (currentUserId: number) => {
  const result = await pool.query(`
   WITH chat_list AS (
      SELECT
          c.id AS id,
          c.type,
          c.name,
          c.created_at AS "createdAt",
    
          -- Add creator as a JSON object
          json_build_object(
              'id', creator.id,
              'username', creator.username,
              'email', creator.email,
              'image', creator.image,
              'createdAt', creator.created_at,
              'emailVerified', creator.email_verified,
              'updatedAt', creator.updated_at
          ) AS creator,
    
          -- participants (excluding current user in direct chats)
          json_agg(
              json_build_object(
                  'id', u.id,
                  'username', u.username,
                  'email', u.email,
                  'image', u.image,
                  'createdAt', u.created_at,
                  'emailVerified', u.email_verified,
                  'updatedAt', u.updated_at
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
                      'email', sender.email,
                      'image', sender.image,
                      'createdAt', sender.created_at,
                      'emailVerified', sender.email_verified,
                      'updatedAt', sender.updated_at
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
      -- Join to the creator user
      JOIN users creator ON creator.id = c.creator_id
      WHERE c.id IN (
          SELECT conversation_id
          FROM conversation_participants
          WHERE user_id = $1
      )
      -- Group by creator.id as well
      GROUP BY c.id, creator.id
    )
    SELECT *
    FROM chat_list
    ORDER BY COALESCE(("lastMessage" ->>'createdAt')::timestamptz, "createdAt") DESC;
  `, [currentUserId]);

  return result.rows;
}

export const getById = async (currentUserId: number, secondUserId: number): Promise<Conversation | null> => {
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
    // Return full conversation object with creator
    const { rows } = await pool.query(`
        SELECT c.id,
               c.name,
               c.type,
               c.created_at AS "createdAt",
               json_build_object(
                       'id', creator.id,
                       'username', creator.username,
                       'email', creator.email,
                       'image', creator.image,
                       'createdAt', creator.created_at,
                       'emailVerified', creator.email_verified,
                       'updatedAt', creator.updated_at
               )            AS creator,
               json_agg(
                       json_build_object(
                               'id', u.id,
                               'username', u.username,
                               'email', u.email,
                               'image', u.image,
                               'createdAt', u.created_at,
                               'emailVerified', u.email_verified,
                               'updatedAt', u.updated_at
                       )
               )            AS participants,
               NULL         as "lastMessage"
        FROM conversations c
                 JOIN conversation_participants cp ON cp.conversation_id = c.id
                 JOIN users u ON u.id = cp.user_id
                 JOIN users creator ON creator.id = c.creator_id
        WHERE c.id = $1
        GROUP BY c.id, creator.id
    `, [existing.rows[0].id]);

    return rows[0];
  } else {
    return null;
  }
};


export const createDirect = async (currentUserId: number, secondUserId: number): Promise<Conversation> => {
  // Create new
  const conversationRes = await pool.query(
    `INSERT INTO conversations (type, creator_id)
     VALUES ('direct', $1) RETURNING id, name, type, created_at, creator_id`,
    [currentUserId],
  );
  const conversation = conversationRes.rows[0];

  await pool.query(
    `INSERT INTO conversation_participants (conversation_id, user_id)
     VALUES ($1, $2),
            ($1, $3)`,
    [conversation.id, currentUserId, secondUserId],
  );

  // Fetch full conversation object with participants, lastMessage null
  const { rows } = await pool.query(`
      SELECT c.id,
             c.name,
             c.type,
             c.created_at AS "createdAt",
             -- Fetch creator as a JSON object
             json_build_object(
                     'id', creator.id,
                     'username', creator.username,
                     'email', creator.email,
                     'image', creator.image,
                     'createdAt', creator.created_at,
                     'emailVerified', creator.email_verified,
                     'updatedAt', creator.updated_at
             )            AS creator,
             json_agg(
                     json_build_object(
                             'id', u.id,
                             'username', u.username,
                             'email', u.email,
                             'image', u.image,
                             'createdAt', u.created_at,
                             'emailVerified', u.email_verified,
                             'updatedAt', u.updated_at
                     )
             )            AS participants,
             NULL         as "lastMessage"
      FROM conversations c
               JOIN conversation_participants cp ON cp.conversation_id = c.id
               JOIN users u ON u.id = cp.user_id
               JOIN users creator ON creator.id = c.creator_id
      WHERE c.id = $1
      GROUP BY c.id, creator.id

  `, [conversation.id]);

  return rows[0];
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
