-- Crear tabla para registros de gastos
CREATE TABLE IF NOT EXISTS billing_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    description TEXT,
    billing_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    billing_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    billing_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, paid, cancelled
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata útil para análisis
    resource_type VARCHAR(50), -- compute, storage, network, etc.
    usage_quantity DECIMAL(12,2),
    usage_unit VARCHAR(20), -- GB, hours, requests, etc.
    rate_per_unit DECIMAL(12,4),
    
    CONSTRAINT billing_records_service_fkey 
        FOREIGN KEY (service_id) 
        REFERENCES services(id) 
        ON DELETE CASCADE,
    CONSTRAINT billing_records_dates_check 
        CHECK (billing_period_end > billing_period_start),
    CONSTRAINT billing_records_status_check 
        CHECK (status IN ('pending', 'paid', 'cancelled')),
    CONSTRAINT billing_records_amount_check 
        CHECK (amount >= 0)
);

-- Crear índices para mejorar el rendimiento de las consultas comunes
CREATE INDEX IF NOT EXISTS idx_billing_records_service_id 
    ON billing_records(service_id);
CREATE INDEX IF NOT EXISTS idx_billing_records_billing_date 
    ON billing_records(billing_date);
CREATE INDEX IF NOT EXISTS idx_billing_records_status 
    ON billing_records(status);

-- Crear vista para resumen de gastos por servicio
CREATE OR REPLACE VIEW service_billing_summary AS
SELECT 
    s.id AS service_id,
    s.name AS service_name,
    s.provider_name,
    COUNT(br.id) AS total_records,
    SUM(CASE WHEN br.status = 'paid' THEN br.amount ELSE 0 END) AS total_paid,
    SUM(CASE WHEN br.status = 'pending' THEN br.amount ELSE 0 END) AS total_pending,
    MIN(br.billing_date) AS first_billing_date,
    MAX(br.billing_date) AS last_billing_date
FROM services s
LEFT JOIN billing_records br ON s.id = br.service_id
GROUP BY s.id, s.name, s.provider_name;

-- Crear función para insertar nuevo registro de gasto
CREATE OR REPLACE FUNCTION insert_billing_record(
    p_service_id UUID,
    p_amount DECIMAL,
    p_description TEXT,
    p_period_start TIMESTAMP WITH TIME ZONE,
    p_period_end TIMESTAMP WITH TIME ZONE,
    p_resource_type VARCHAR DEFAULT NULL,
    p_usage_quantity DECIMAL DEFAULT NULL,
    p_usage_unit VARCHAR DEFAULT NULL,
    p_rate_per_unit DECIMAL DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_record_id UUID;
BEGIN
    INSERT INTO billing_records (
        service_id,
        amount,
        description,
        billing_period_start,
        billing_period_end,
        resource_type,
        usage_quantity,
        usage_unit,
        rate_per_unit
    ) VALUES (
        p_service_id,
        p_amount,
        p_description,
        p_period_start,
        p_period_end,
        p_resource_type,
        p_usage_quantity,
        p_usage_unit,
        p_rate_per_unit
    ) RETURNING id INTO v_record_id;

    RETURN v_record_id;
END;
$$ LANGUAGE plpgsql;

-- Crear políticas RLS para billing_records
ALTER TABLE billing_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura de registros de gastos a usuarios autenticados"
    ON billing_records FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Permitir inserción de registros de gastos a usuarios autenticados"
    ON billing_records FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Permitir actualización de registros de gastos a usuarios autenticados"
    ON billing_records FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_billing_record_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_billing_records_timestamp
    BEFORE UPDATE ON billing_records
    FOR EACH ROW
    EXECUTE FUNCTION update_billing_record_timestamp();
