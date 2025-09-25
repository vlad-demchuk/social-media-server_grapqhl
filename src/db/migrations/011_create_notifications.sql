CREATE TYPE notification_type AS ENUM ('LIKE', 'COMMENT', 'MESSAGE');

CREATE TABLE notifications
(
    id           SERIAL PRIMARY KEY,
    recipient_id INT               NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    actor_id     INT               NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    type         notification_type NOT NULL,
    entity_id    INT               NOT NULL,
    entity_type  VARCHAR(20)       NOT NULL CHECK (entity_type IN ('POST', 'COMMENT', 'MESSAGE')),
    preview      TEXT,
    read         BOOLEAN                  DEFAULT FALSE,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_notifications_recipient_id ON notifications (recipient_id);
CREATE INDEX idx_notifications_read ON notifications (read);
CREATE INDEX idx_notifications_entity ON notifications (entity_id, entity_type);
