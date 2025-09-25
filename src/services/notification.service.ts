import { pool } from '../db/db';

export const getAll = async (recipientId: number) => {
  const { rows } = await pool.query(
    `SELECT n.*,
            json_build_object(
                    'id', u.id,
                    'username', u.username,
                    'email', u.email,
                    'image', u.image,
                    'createdAt', u.created_at,
                    'emailVerified', u.email_verified,
                    'updatedAt', u.updated_at
            ) as actor
     FROM notifications n
              JOIN users u ON u.id = n.actor_id
     WHERE recipient_id = $1
     ORDER BY created_at DESC`,
    [recipientId],
  );
  return rows;
};

export const create = async ({
  recipientId,
  actorId,
  type,
  entityId,
  entityType,
  preview,
}: {
  recipientId: number;
  actorId: number;
  type: 'LIKE' | 'COMMENT' | 'MESSAGE';
  entityId: number;
  entityType: 'POST' | 'COMMENT' | 'MESSAGE';
  preview?: string;
}) => {
  const { rows } = await pool.query(
    `
        WITH upsert AS (
        INSERT
        INTO notifications (recipient_id, actor_id, type, entity_id, entity_type, preview)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (recipient_id, actor_id, type, entity_id, entity_type)
            DO
        UPDATE SET created_at = NOW(), preview = EXCLUDED.preview
            RETURNING *
            )
        SELECT upsert.*,
               json_build_object(
                       'id', u.id,
                       'username', u.username,
                       'email', u.email,
                       'image', u.image,
                       'createdAt', u.created_at,
                       'emailVerified', u.email_verified,
                       'updatedAt', u.updated_at
               ) AS actor
        FROM upsert
                 JOIN users u ON u.id = upsert.actor_id
    `,
    [recipientId, actorId, type, entityId, entityType, preview ?? null],
  );

  return rows[0];
};
