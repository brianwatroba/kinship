-- Migration for creating the posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY,
    topic_id UUID REFERENCES topics (id),
    user_id UUID REFERENCES users (id),
    type TEXT,
    content VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to update 'updated_at' column on row update
CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE PROCEDURE moddatetime (updated_at);