export interface Session {
  id: number;
  browser: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

export const sessions: Session[] = [
  {
    id: 1,
    browser: 'Chrome',
    device: 'Windows 11',
    location: 'Medellín, Colombia',
    ip: '192.168.xxx.xxx',
    lastActive: 'Now',
    current: true,
  },
  {
    id: 2,
    browser: 'Safari',
    device: 'iPhone 15',
    location: 'Bogotá, Colombia',
    ip: '181.xxx.xxx.xxx',
    lastActive: 'Yesterday',
    current: false,
  },
  {
    id: 3,
    browser: 'Edge',
    device: 'Windows 11',
    location: 'Cali, Colombia',
    ip: '191.xxx.xxx.xxx',
    lastActive: '2 days ago',
    current: false,
  },
];