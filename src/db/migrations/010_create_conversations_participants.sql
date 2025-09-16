CREATE TABLE conversation_participants (
    id SERIAL PRIMARY KEY,
    conversation_id SERIAL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id SERIAL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (conversation_id, user_id)
);
