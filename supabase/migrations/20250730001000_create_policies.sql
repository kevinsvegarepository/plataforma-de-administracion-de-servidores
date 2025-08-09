-- Habilitar RLS en todas las tablas si no está habilitado
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_network_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_network_ports ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_custom_fields ENABLE ROW LEVEL SECURITY;

-- Crear políticas para services
CREATE POLICY "Allow authenticated users to read services"
  ON services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update services"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete services"
  ON services FOR DELETE
  TO authenticated
  USING (true);

-- Crear políticas para service_specifications
CREATE POLICY "Allow authenticated users to read specifications"
  ON service_specifications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert specifications"
  ON service_specifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update specifications"
  ON service_specifications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete specifications"
  ON service_specifications FOR DELETE
  TO authenticated
  USING (true);

-- Crear políticas para service_network_config
CREATE POLICY "Allow authenticated users to read network config"
  ON service_network_config FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert network config"
  ON service_network_config FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update network config"
  ON service_network_config FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete network config"
  ON service_network_config FOR DELETE
  TO authenticated
  USING (true);

-- Crear políticas para service_network_ports
CREATE POLICY "Allow authenticated users to read network ports"
  ON service_network_ports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert network ports"
  ON service_network_ports FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update network ports"
  ON service_network_ports FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete network ports"
  ON service_network_ports FOR DELETE
  TO authenticated
  USING (true);

-- Crear políticas para service_credentials
CREATE POLICY "Allow authenticated users to read credentials"
  ON service_credentials FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert credentials"
  ON service_credentials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update credentials"
  ON service_credentials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete credentials"
  ON service_credentials FOR DELETE
  TO authenticated
  USING (true);

-- Crear políticas para sub_services
CREATE POLICY "Allow authenticated users to read sub services"
  ON sub_services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert sub services"
  ON sub_services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update sub services"
  ON sub_services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete sub services"
  ON sub_services FOR DELETE
  TO authenticated
  USING (true);

-- Crear políticas para service_custom_fields
CREATE POLICY "Allow authenticated users to read custom fields"
  ON service_custom_fields FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert custom fields"
  ON service_custom_fields FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update custom fields"
  ON service_custom_fields FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete custom fields"
  ON service_custom_fields FOR DELETE
  TO authenticated
  USING (true);
