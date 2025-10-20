// Global types for the application

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'trainer' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Trainer {
  id: string;
  user: User;
  code: string;
  specialties: string[];
  certifications: Certification[];
  hourlyRate: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  certificateNumber?: string;
}

export interface Partner {
  id: string;
  code: string;
  name: string;
  type: 'client' | 'supplier' | 'partner' | 'other';
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  description?: string;
  partner: Partner;
  type: 'service' | 'purchase' | 'sale' | 'lease' | 'partnership' | 'other';
  value: number;
  currency: 'VND' | 'USD' | 'EUR';
  signDate: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'expired' | 'terminated' | 'completed';
  attachments: Attachment[];
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: User;
  uploadedAt: string;
}

export interface Schedule {
  id: string;
  trainer: Trainer;
  clientName: string;
  clientPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  location: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SearchFilters {
  search?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  status?: string[];
  trainerSpecialties?: string[];
  location?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardStats {
  totalContracts: number;
  completedContracts: number;
  activeContracts: number;
  activeTrainers: number;
  totalRevenue: number;
  monthlyRevenue: number[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }[];
}
