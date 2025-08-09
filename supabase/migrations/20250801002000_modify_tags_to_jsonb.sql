-- Modificar la columna tags para usar JSONB
ALTER TABLE services ALTER COLUMN tags DROP DEFAULT;
ALTER TABLE services ALTER COLUMN tags TYPE JSONB USING COALESCE(
    CASE 
        WHEN tags IS NULL THEN '[]'::JSONB
        WHEN tags = '{}' THEN '[]'::JSONB
        ELSE array_to_json(tags)::JSONB
    END,
    '[]'::JSONB
);
ALTER TABLE services ALTER COLUMN tags SET DEFAULT '[]'::JSONB;

-- Crear un índice GIN para mejorar las búsquedas en el campo JSONB
CREATE INDEX idx_services_tags ON services USING GIN (tags);

-- Función para actualizar tags
-- Primero eliminamos la función anterior si existe
DROP FUNCTION IF EXISTS update_service_tags(UUID, TEXT[]);

CREATE OR REPLACE FUNCTION update_service_tags_json(
    p_service_id UUID,
    p_tags TEXT
) RETURNS void AS $$
BEGIN
    UPDATE services
    SET tags = p_tags::JSONB,
        updated_at = NOW()
    WHERE id = p_service_id;
END;
$$ LANGUAGE plpgsql;
