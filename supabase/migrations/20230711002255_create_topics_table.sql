-- Migration for creating the topics table
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY,
    family_id UUID REFERENCES families (id),
    completed BOOLEAN DEFAULT false,
    summary_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to update 'updated_at' column on row update
CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON topics
FOR EACH ROW
EXECUTE PROCEDURE moddatetime (updated_at);