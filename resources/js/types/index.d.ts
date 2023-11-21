export interface User {
    id: number;
    user_id: number | null;
    name: string;
    email: string;
    email_verified_at: string | null;
}

export interface CustomFieldValue {
    id?: number;  // Making it optional
    customer_id?: number;  // Making it optional
    custom_field?: any;  // Making it optional
    field_id: number;
    value: any;
    // ... any other fields for CustomFieldValue
}

export interface CustomField {
    id: number;
    user_id: number;
    field_name: string;
    field_type: string;
    // ... any other fields for CustomFieldValue
}

export interface Customer {
    id: number;
    user_id: number;
    name: string;
    email: string;
    phone_number: string;
    custom_fields_values: CustomFieldValue[];  // <-- Add this line
    notes: Note[];
    // ... any other fields for Customer
}

export interface Note {
    id: number;
    customer_id: number;
    user_id: number;
    customer_name: string;
    user_name: string;
    title: string;
    content: string;
}

export interface Category {
    id: number;
    name: string;
    description: string;
}
export interface Product {
    id: number;
    name: string;
    description: string
    price: number
    sku: string | any | null;
    inventory_count: number;
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
        customer_profile:Customer[];
        products:Product[];
        categories:Category[];
    };
};
