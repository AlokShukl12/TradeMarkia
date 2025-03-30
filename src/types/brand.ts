export interface Brand {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string;
  registrationDate: string;
  status: 'Active' | 'Pending' | 'Expired';
  owner: string;
  country: string;
  trademarkNumber: string;
  lawFirm: string;
  attorney: string;
  filingDate: string;
  registrationNumber: string;
  goodsAndServices: string[];
  priorityDate?: string;
  renewalDate?: string;
}

export interface BrandCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface FilterOptions {
  owner: string[];
  lawFirm: string[];
  attorney: string[];
  status: ('Active' | 'Pending' | 'Expired')[];
  category: string[];
} 