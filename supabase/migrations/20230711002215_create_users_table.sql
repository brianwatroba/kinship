-- Migration for creating the users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    auth_id UUID REFERENCES auth.users ON DELETE CASCADE,
    family_id UUID REFERENCES families (id),
    first_name VARCHAR,
    last_name VARCHAR,
    phone VARCHAR,
    image VARCHAR,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to update 'updated_at' column on row update
CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE moddatetime (updated_at);