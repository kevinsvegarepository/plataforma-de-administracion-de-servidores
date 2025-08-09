-- Crear tabla para el registro de gastos mensuales
CREATE TABLE IF NOT EXISTS monthly_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    total_hours DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
    projected_hours DECIMAL(12,2),
    projected_cost DECIMAL(12,2),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadatos adicionales
    average_daily_hours DECIMAL(12,2),
    peak_day_hours DECIMAL(12,2),
    peak_day_date DATE,
    total_days_active INT,
    notes TEXT,

    CONSTRAINT monthly_expenses_service_fkey 
        FOREIGN KEY (service_id) 
        REFERENCES services(id) 
        ON DELETE CASCADE,
    
    -- Asegurar que el mes esté entre 1 y 12
    CONSTRAINT month_range_check 
        CHECK (month BETWEEN 1 AND 12),
    
    -- Asegurar valores no negativos
    CONSTRAINT positive_values_check 
        CHECK (
            total_hours >= 0 AND 
            total_cost >= 0 AND 
            (projected_hours IS NULL OR projected_hours >= 0) AND
            (projected_cost IS NULL OR projected_cost >= 0) AND
            (average_daily_hours IS NULL OR average_daily_hours >= 0) AND
            (peak_day_hours IS NULL OR peak_day_hours >= 0)
        ),
    
    -- Evitar duplicados para el mismo servicio/mes/año
    CONSTRAINT unique_service_month_year 
        UNIQUE (service_id, year, month)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_monthly_expenses_service_id 
    ON monthly_expenses(service_id);
CREATE INDEX IF NOT EXISTS idx_monthly_expenses_year_month 
    ON monthly_expenses(year, month);

-- Vista para resumen del mes actual
CREATE OR REPLACE VIEW current_month_expenses AS
SELECT 
    s.id AS service_id,
    s.name AS service_name,
    s.provider_name,
    me.total_hours,
    me.total_cost,
    me.projected_hours,
    me.projected_cost,
    me.average_daily_hours,
    me.last_updated
FROM services s
LEFT JOIN monthly_expenses me ON s.id = me.service_id
    AND me.year = EXTRACT(YEAR FROM CURRENT_DATE)
    AND me.month = EXTRACT(MONTH FROM CURRENT_DATE);

-- Función para actualizar o crear registro mensual
CREATE OR REPLACE FUNCTION upsert_monthly_expense(
    p_service_id UUID,
    p_total_hours DECIMAL,
    p_total_cost DECIMAL,
    p_projected_hours DECIMAL DEFAULT NULL,
    p_projected_cost DECIMAL DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_year INT := EXTRACT(YEAR FROM CURRENT_DATE)::INT;
    v_month INT := EXTRACT(MONTH FROM CURRENT_DATE)::INT;
    v_record_id UUID;
    v_avg_daily_hours DECIMAL;
    v_days_active INT;
BEGIN
    -- Calcular métricas adicionales
    SELECT 
        COUNT(DISTINCT DATE(timestamp))::INT,
        COALESCE(AVG(duration), 0)
    INTO v_days_active, v_avg_daily_hours
    FROM service_usage_logs
    WHERE service_id = p_service_id
    AND DATE(timestamp) >= DATE_TRUNC('month', CURRENT_DATE)
    AND DATE(timestamp) < DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month');

    -- Insertar o actualizar registro
    INSERT INTO monthly_expenses (
        service_id,
        year,
        month,
        total_hours,
        total_cost,
        projected_hours,
        projected_cost,
        average_daily_hours,
        total_days_active,
        notes,
        last_updated
    ) VALUES (
        p_service_id,
        v_year,
        v_month,
        p_total_hours,
        p_total_cost,
        p_projected_hours,
        p_projected_cost,
        v_avg_daily_hours,
        v_days_active,
        p_notes,
        NOW()
    )
    ON CONFLICT (service_id, year, month) DO UPDATE SET
        total_hours = EXCLUDED.total_hours,
        total_cost = EXCLUDED.total_cost,
        projected_hours = EXCLUDED.projected_hours,
        projected_cost = EXCLUDED.projected_cost,
        average_daily_hours = EXCLUDED.average_daily_hours,
        total_days_active = EXCLUDED.total_days_active,
        notes = EXCLUDED.notes,
        last_updated = NOW()
    RETURNING id INTO v_record_id;

    RETURN v_record_id;
END;
$$ LANGUAGE plpgsql;

-- Políticas RLS para monthly_expenses
ALTER TABLE monthly_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura de gastos mensuales a usuarios autenticados"
    ON monthly_expenses FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Permitir inserción de gastos mensuales a usuarios autenticados"
    ON monthly_expenses FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Permitir actualización de gastos mensuales a usuarios autenticados"
    ON monthly_expenses FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Trigger para actualizar last_updated
CREATE OR REPLACE FUNCTION update_monthly_expense_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_monthly_expenses_timestamp
    BEFORE UPDATE ON monthly_expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_monthly_expense_timestamp();
