-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    website TEXT,
    support_email TEXT,
    support_phone TEXT,
    logo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger for updating updated_at
CREATE TRIGGER update_providers_updated_at
    BEFORE UPDATE ON providers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Usuarios autenticados tienen acceso completo a providers"
    ON providers FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);
