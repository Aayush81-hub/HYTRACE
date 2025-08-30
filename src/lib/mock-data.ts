export type GHCToken = {
  id: number;
  producer: string;
  energySource: 'Solar' | 'Wind' | 'Hydro';
  productionDate: string;
  price: number;
  status: 'Available' | 'Owned' | 'Retired';
  owner?: string;
};

export type AuditLog = {
  txHash: string;
  eventType: 'Mint' | 'Transfer' | 'Retire';
  tokenId: number;
  from: string;
  to: string;
  timestamp: string;
};

export const ghcTokens: GHCToken[] = [
  { id: 101, producer: '0x1a2b...c3d4', energySource: 'Solar', productionDate: '2024-05-01', price: 150.5, status: 'Available' },
  { id: 102, producer: '0x5e6f...g7h8', energySource: 'Wind', productionDate: '2024-05-02', price: 162.0, status: 'Available' },
  { id: 103, producer: '0x9i0j...k1l2', energySource: 'Solar', productionDate: '2024-05-03', price: 148.75, status: 'Available' },
  { id: 104, producer: '0x1a2b...c3d4', energySource: 'Hydro', productionDate: '2024-05-04', price: 175.0, status: 'Owned', owner: '0x3FC8984096d556941F55EAD12f291332b26D660d' },
  { id: 105, producer: '0x5e6f...g7h8', energySource: 'Wind', productionDate: '2024-05-05', price: 165.25, status: 'Retired', owner: '0x3FC8984096d556941F55EAD12f291332b26D660d' },
  { id: 106, producer: '0x9i0j...k1l2', energySource: 'Solar', productionDate: '2024-05-06', price: 152.0, status: 'Available' },
];

export const myGhcCredits: GHCToken[] = [
    { id: 104, producer: '0x1a2b...c3d4', energySource: 'Hydro', productionDate: '2024-05-04', price: 175.0, status: 'Owned', owner: '0x3FC8984096d556941F55EAD12f291332b26D660d' },
    { id: 105, producer: '0x5e6f...g7h8', energySource: 'Wind', productionDate: '2024-05-05', price: 165.25, status: 'Retired', owner: '0x3FC8984096d556941F55EAD12f291332b26D660d' },
    { id: 201, producer: '0xAnother...Producer', energySource: 'Solar', productionDate: '2024-06-10', price: 155.0, status: 'Owned', owner: '0x3FC8984096d556941F55EAD12f291332b26D660d' },
];

export const auditLogs: AuditLog[] = [
  { txHash: '0xabc...123', eventType: 'Mint', tokenId: 101, from: '0x000...000', to: '0x1a2b...c3d4', timestamp: '2024-05-01T10:00:00Z' },
  { txHash: '0xdef...456', eventType: 'Mint', tokenId: 102, from: '0x000...000', to: '0x5e6f...g7h8', timestamp: '2024-05-02T11:00:00Z' },
  { txHash: '0xghi...789', eventType: 'Mint', tokenId: 104, from: '0x000...000', to: '0x1a2b...c3d4', timestamp: '2024-05-04T09:30:00Z' },
  { txHash: '0xjkl...012', eventType: 'Transfer', tokenId: 104, from: '0x1a2b...c3d4', to: '0x3FC8984096d556941F55EAD12f291332b26D660d', timestamp: '2024-05-15T14:00:00Z' },
  { txHash: '0xmno...345', eventType: 'Mint', tokenId: 105, from: '0x000...000', to: '0x5e6f...g7h8', timestamp: '2024-05-05T12:00:00Z' },
  { txHash: '0xpqr...678', eventType: 'Transfer', tokenId: 105, from: '0x5e6f...g7h8', to: '0x3FC8984096d556941F55EAD12f291332b26D660d', timestamp: '2024-05-20T18:00:00Z' },
  { txHash: '0xstu...901', eventType: 'Retire', tokenId: 105, from: '0x3FC8984096d556941F55EAD12f291332b26D660d', to: '0x000...000', timestamp: '2024-06-01T20:00:00Z' },
];
