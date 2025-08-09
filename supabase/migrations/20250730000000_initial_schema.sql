-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create services table first (tabla principal)
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    is_running BOOLEAN DEFAULT false,
    purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
    renewal_date TIMESTAMP WITH TIME ZONE NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
    estimated_monthly_hours INTEGER DEFAULT 720,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    total_running_hours INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_specifications table
CREATE TABLE IF NOT EXISTS service_specifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_network_config table
CREATE TABLE IF NOT EXISTS service_network_config (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE UNIQUE,
    public_ip TEXT,
    private_ip TEXT,
    internal_ip TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_network_ports table
CREATE TABLE IF NOT EXISTS service_network_ports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    port INTEGER NOT NULL,
    description TEXT,
    is_open BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_credentials table
CREATE TABLE IF NOT EXISTS service_credentials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sub_services table
CREATE TABLE IF NOT EXISTS sub_services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    parent_service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_custom_fields table
CREATE TABLE IF NOT EXISTS service_custom_fields (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_service_specifications_service_id ON service_specifications(service_id);
CREATE INDEX idx_service_network_ports_service_id ON service_network_ports(service_id);
CREATE INDEX idx_service_credentials_service_id ON service_credentials(service_id);
CREATE INDEX idx_sub_services_parent_service_id ON sub_services(parent_service_id);
CREATE INDEX idx_service_custom_fields_service_id ON service_custom_fields(service_id);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar el trigger a todas las tablas
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_specifications_updated_at
    BEFORE UPDATE ON service_specifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_network_config_updated_at
    BEFORE UPDATE ON service_network_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_network_ports_updated_at
    BEFORE UPDATE ON service_network_ports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_credentials_updated_at
    BEFORE UPDATE ON service_credentials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sub_services_updated_at
    BEFORE UPDATE ON sub_services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_custom_fields_updated_at
    BEFORE UPDATE ON service_custom_fields
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_network_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_network_ports ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_custom_fields ENABLE ROW LEVEL SECURITY;

-- Crear políticas para cada tabla
CREATE POLICY "Usuarios autenticados tienen acceso completo a services" 
    ON services FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Usuarios autenticados tienen acceso completo a specifications" 
    ON service_specifications FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Usuarios autenticados tienen acceso completo a network_config" 
    ON service_network_config FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Usuarios autenticados tienen acceso completo a network_ports" 
    ON service_network_ports FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Usuarios autenticados tienen acceso completo a credentials" 
    ON service_credentials FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Usuarios autenticados tienen acceso completo a sub_services" 
    ON sub_services FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Usuarios autenticados tienen acceso completo a custom_fields" 
    ON service_custom_fields FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);
