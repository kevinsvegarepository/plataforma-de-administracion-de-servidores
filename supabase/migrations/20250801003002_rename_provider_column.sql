-- Rename provider column to provider_name and add provider_id
ALTER TABLE services RENAME COLUMN provider TO provider_name;
ALTER TABLE services ADD COLUMN provider_id uuid REFERENCES providers(id);

-- Create an index for better performance on joins
CREATE INDEX IF NOT EXISTS services_provider_id_idx ON services(provider_id);
