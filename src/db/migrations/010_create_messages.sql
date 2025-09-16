CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id SERIAL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id SERIAL REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
