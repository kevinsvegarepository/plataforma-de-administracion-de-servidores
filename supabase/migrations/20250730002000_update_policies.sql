-- Actualizar las políticas para permitir acceso público temporalmente
DROP POLICY IF EXISTS "Allow authenticated users to read services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to insert services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to update services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to delete services" ON services;

CREATE POLICY "Allow public access to services" ON services
FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read specifications" ON service_specifications;
DROP POLICY IF EXISTS "Allow authenticated users to insert specifications" ON service_specifications;
DROP POLICY IF EXISTS "Allow authenticated users to update specifications" ON service_specifications;
DROP POLICY IF EXISTS "Allow authenticated users to delete specifications" ON service_specifications;

CREATE POLICY "Allow public access to specifications" ON service_specifications
FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read network config" ON service_network_config;
DROP POLICY IF EXISTS "Allow authenticated users to insert network config" ON service_network_config;
DROP POLICY IF EXISTS "Allow authenticated users to update network config" ON service_network_config;
DROP POLICY IF EXISTS "Allow authenticated users to delete network config" ON service_network_config;

CREATE POLICY "Allow public access to network config" ON service_network_config
FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read network ports" ON service_network_ports;
DROP POLICY IF EXISTS "Allow authenticated users to insert network ports" ON service_network_ports;
DROP POLICY IF EXISTS "Allow authenticated users to update network ports" ON service_network_ports;
DROP POLICY IF EXISTS "Allow authenticated users to delete network ports" ON service_network_ports;

CREATE POLICY "Allow public access to network ports" ON service_network_ports
FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read credentials" ON service_credentials;
DROP POLICY IF EXISTS "Allow authenticated users to insert credentials" ON service_credentials;
DROP POLICY IF EXISTS "Allow authenticated users to update credentials" ON service_credentials;
DROP POLICY IF EXISTS "Allow authenticated users to delete credentials" ON service_credentials;

CREATE POLICY "Allow public access to credentials" ON service_credentials
FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read sub services" ON sub_services;
DROP POLICY IF EXISTS "Allow authenticated users to insert sub services" ON sub_services;
DROP POLICY IF EXISTS "Allow authenticated users to update sub services" ON sub_services;
DROP POLICY IF EXISTS "Allow authenticated users to delete sub services" ON sub_services;

CREATE POLICY "Allow public access to sub services" ON sub_services
FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read custom fields" ON service_custom_fields;
DROP POLICY IF EXISTS "Allow authenticated users to insert custom fields" ON service_custom_fields;
DROP POLICY IF EXISTS "Allow authenticated users to update custom fields" ON service_custom_fields;
DROP POLICY IF EXISTS "Allow authenticated users to delete custom fields" ON service_custom_fields;

CREATE POLICY "Allow public access to custom fields" ON service_custom_fields
FOR ALL USING (true) WITH CHECK (true);
