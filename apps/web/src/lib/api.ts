import type {
  BriefResponse,
  TenantDetailResponse,
  EventDetailResponse,
  Tenant,
  Property,
  Evidence,
  DemoRole,
} from "@/types";

class APIError extends Error {
  constructor(
    public status: number,
    public details: unknown
  ) {
    super(`API Error: ${status}`);
  }
}

// Demo role stored in memory
let currentRole: DemoRole = "exec";
let currentUser: string = "Demo User";

export function setDemoRole(role: DemoRole, user?: string) {
  currentRole = role;
  if (user) currentUser = user;
}

export function getDemoRole(): DemoRole {
  return currentRole;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`/api/v1${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-DEMO-ROLE": currentRole,
      "X-DEMO-USER": currentUser,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new APIError(res.status, error);
  }

  return res.json();
}

export const api = {
  // Brief
  getBrief: (asOfDate?: string) => {
    const params = asOfDate ? `?as_of_date=${asOfDate}` : "";
    return request<BriefResponse>(`/brief${params}`);
  },

  // Tenants
  getTenants: (status?: string) => {
    const params = status ? `?status=${status}` : "";
    return request<Tenant[]>(`/tenants${params}`);
  },

  getTenant: (id: string) => {
    return request<TenantDetailResponse>(`/tenants/${id}`);
  },

  // Events
  getEvent: (id: string) => {
    return request<EventDetailResponse>(`/events/${id}`);
  },

  getEventEvidence: (eventId: string) => {
    return request<Evidence[]>(`/events/${eventId}/evidence`);
  },

  // Properties
  getProperties: () => {
    return request<Property[]>("/properties");
  },

  getProperty: (id: string) => {
    return request<Property>(`/properties/${id}`);
  },

  // Search
  search: (query: string) => {
    return request<{ tenants: Tenant[]; properties: Property[] }>(
      `/search?q=${encodeURIComponent(query)}`
    );
  },
};

export { APIError };
