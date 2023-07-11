-- Migration for creating the families table
CREATE TABLE IF NOT EXISTS families (
    id UUID PRIMARY KEY,
    name VARCHAR,
    image VARCHAR,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to update 'updated_at' column on row update
CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON families
FOR EACH ROW
EXECUTE PROCEDURE moddatetime (updated_at);