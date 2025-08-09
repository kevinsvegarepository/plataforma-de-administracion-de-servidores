import { Service, Provider } from '../types';

export const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'AWS',
    website: 'https://aws.amazon.com',
    supportEmail: 'support@aws.amazon.com',
    supportPhone: '+1-800-221-1212'
  },
  {
    id: '2',
    name: 'DigitalOcean',
    website: 'https://digitalocean.com',
    supportEmail: 'support@digitalocean.com',
    supportPhone: '+1-888-890-2590'
  },
  {
    id: '3',
    name: 'Vultr',
    website: 'https://vultr.com',
    supportEmail: 'support@vultr.com',
    supportPhone: '+1-855-385-8787'
  },
  {
    id: '4',
    name: 'Google Cloud',
    website: 'https://cloud.google.com',
    supportEmail: 'support@google.com',
    supportPhone: '+1-855-836-3987'
  }
];

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Servidor Web Principal',
    type: 'virtual-machine',
    provider: 'DigitalOcean',
    status: 'active',
    isRunning: true,
    purchaseDate: new Date('2024-01-15'),
    renewalDate: new Date('2024-02-15'),
    hourlyRate: 0.089,
    estimatedMonthlyHours: 720, // 24/7
    description: 'Servidor principal para aplicaciones web',
    specifications: {
      cpu: '4 vCPUs',
      ram: '8 GB',
      storage: '160 GB SSD',
      bandwidth: '5 TB',
      os: 'Ubuntu 22.04',
      location: 'Nueva York'
    },
    networkConfig: {
      publicIp: '192.168.1.100',
      privateIp: '10.0.0.10',
      internalIp: '172.16.0.10',
      openPorts: [
        { port: 80, protocol: 'TCP', description: 'HTTP', isOpen: true },
        { port: 443, protocol: 'TCP', description: 'HTTPS', isOpen: true },
        { port: 22, protocol: 'TCP', description: 'SSH', isOpen: true }
      ]
    },
    credentials: {
      username: 'root',
      password: 'encrypted_password_here',
      sshKey: 'ssh-rsa AAAAB3NzaC1yc2E...'
    },
    subServices: [
      {
        id: 'sub1',
        name: 'Load Balancer',
        type: 'load-balancer',
        status: 'active',
        hourlyRate: 0.025,
        description: 'Balanceador de carga asociado'
      }
    ],
    customFields: [
      { key: 'Backup Schedule', value: 'Daily at 2 AM', type: 'text' },
      { key: 'Monitoring Enabled', value: 'true', type: 'boolean' }
    ],
    tags: ['produccion', 'web', 'critical'],
    notes: 'Servidor crítico para producción',
    totalRunningHours: 156.5,
    lastStartTime: new Date('2024-01-20T10:30:00'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Base de Datos MySQL',
    type: 'database',
    provider: 'AWS',
    status: 'active',
    isRunning: false,
    purchaseDate: new Date('2024-01-10'),
    renewalDate: new Date('2024-03-10'),
    hourlyRate: 0.175,
    estimatedMonthlyHours: 600,
    description: 'Base de datos managed MySQL para aplicaciones',
    specifications: {
      cpu: '2 vCPUs',
      ram: '16 GB',
      storage: '500 GB',
      bandwidth: 'Ilimitado',
      location: 'Virginia',
      version: 'MySQL 8.0'
    },
    networkConfig: {
      privateIp: '10.0.1.20',
      internalIp: '172.16.1.20',
      openPorts: [
        { port: 3306, protocol: 'TCP', description: 'MySQL', isOpen: true }
      ]
    },
    credentials: {
      username: 'admin',
      password: 'encrypted_db_password',
      apiKey: 'aws_api_key_here'
    },
    subServices: [],
    customFields: [
      { key: 'Backup Retention', value: '30', type: 'number' },
      { key: 'Multi-AZ', value: 'true', type: 'boolean' }
    ],
    tags: ['database', 'mysql', 'managed'],
    notes: 'Incluye backups automáticos diarios',
    totalRunningHours: 89.2,
    lastStopTime: new Date('2024-01-19T15:45:00'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-19')
  }
];