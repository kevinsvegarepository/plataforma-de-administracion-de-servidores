-- Asegurar que los servicios existentes tengan un provider_id válido

-- Verificar que la columna provider_id existe, si no, crearla
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' AND column_name = 'provider_id'
    ) THEN
        ALTER TABLE services ADD COLUMN provider_id UUID;
    END IF;
END $$;

-- Crear proveedores faltantes
INSERT INTO providers (name)
SELECT DISTINCT provider_name 
FROM services s
WHERE provider_name IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM providers p WHERE p.name = s.provider_name
);

-- Actualizar los provider_id en services
UPDATE services s
SET provider_id = p.id
FROM providers p
WHERE s.provider_name = p.name
AND s.provider_id IS NULL;

-- Agregar restricción de clave foránea
ALTER TABLE services 
    DROP CONSTRAINT IF EXISTS services_provider_id_fkey,
    ADD CONSTRAINT services_provider_id_fkey 
    FOREIGN KEY (provider_id) 
    REFERENCES providers(id)
    ON DELETE SET NULL;

-- Revisar y mostrar servicios sin proveedor
DO $$
DECLARE 
    missing RECORD;
BEGIN 
    -- Mostrar los servicios sin proveedor directamente
    FOR missing IN 
        SELECT id, provider_name 
        FROM services 
        WHERE provider_id IS NULL
    LOOP
        RAISE NOTICE 'Service ID: %, Provider Name: % - Missing provider_id', 
            missing.id, missing.provider_name;
    END LOOP;
END $$;
