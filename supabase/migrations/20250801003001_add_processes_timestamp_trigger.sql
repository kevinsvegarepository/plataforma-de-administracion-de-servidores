-- Crear o reemplazar la función de trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear el trigger si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'trigger_update_processes_updated_at'
    ) THEN
        CREATE TRIGGER trigger_update_processes_updated_at
            BEFORE UPDATE ON processes
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
