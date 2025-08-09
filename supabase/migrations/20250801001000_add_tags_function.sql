-- Crear función para actualizar tags
CREATE OR REPLACE FUNCTION update_service_tags(p_service_id UUID, p_tags TEXT[])
RETURNS void AS $$
BEGIN
    UPDATE services
    SET tags = p_tags,
        updated_at = NOW()
    WHERE id = p_service_id;
END;
$$ LANGUAGE plpgsql;
