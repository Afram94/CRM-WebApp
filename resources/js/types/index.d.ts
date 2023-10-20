export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    /* afram: string; */
    // ... any other fields for Customer
}

type PaginatedResponse<T> = {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  };

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        allUserIdsUnderSameParent: User[];
        user: User;
        customers: PaginatedResponse<Customer>;
    };
};
