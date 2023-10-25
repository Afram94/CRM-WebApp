export interface User {
    id: number;
    user_id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export interface CustomFieldValue {
    id: number;
    customer_id: number;
    field_id: number;
    value: string;
    // ... any other fields for CustomFieldValue
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    custom_fields_values: CustomFieldValue[];  // <-- Add this line
    // ... any other fields for Customer
}

export interface Note {
    id: number;
    customer_name: string;
    user_name: string;
    title: string;
    content: string;
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
        notes: Note[];
        customer_notes:Note[];
    };
};
