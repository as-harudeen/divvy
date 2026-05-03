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
export type GroupId = string;
export type SplitId = string;

export interface Person {
  id: PersonId;
  name: string;
  avatarColor: string;
  createdAt: string;
}

export type GroupStatus = 'active' | 'settled';

export interface Group {
  id: GroupId;
  name: string;
  memberIds: PersonId[];
  createdAt: string;
  lastActivityAt: string;
  status: GroupStatus;
}

export type SettlementStatus = 'open' | 'settled';

export interface Transfer {
  from: PersonId;
  to: PersonId;
  cents: number;
  paidAt?: string;
}

export interface Split {
  id: SplitId;
  groupId: GroupId;
  label: string;
  totalCents: number;
  payerId: PersonId;
  createdAt: string;
  shares: Record<PersonId, number>;
  settlementStatus?: SettlementStatus;
  transfers?: Transfer[];
}
