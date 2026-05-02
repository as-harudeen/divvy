/**
 * A generic typed API response wrapper.
 */
export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

/**
 * Pagination metadata for list endpoints.
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * A paginated API response.
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Base user profile shape (extend for app-specific fields).
 */
export interface UserProfile {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type PersonId = string;

export interface Transfer {
  from: PersonId;
  to: PersonId;
  cents: number;
  paidAt?: string;
}

export interface Split {
  id: string;
  groupId: string;
  label: string;
  totalCents: number;
  payerId: PersonId;
  createdAt: string;
  shares: Record<PersonId, number>;
  settlementStatus?: 'open' | 'settled';
  transfers?: Transfer[];
}
