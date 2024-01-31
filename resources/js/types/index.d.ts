export interface User {
    id: number;
    user_id: number | null;
    name: string;
    email: string;
    email_verified_at: string | null;
}

export interface CustomerCustomFieldValue {
    id?: number;  // Making it optional
    customer_id?: number;  // Making it optional
    custom_field?: any;  // Making it optional
    field_id: number;
    value: any;
    // ... any other fields for CustomFieldValue
}

export interface CustomerCustomField {
    id: number;
    user_id: number;
    field_name: string;
    field_type: string;
    created_at: Date;
    // ... any other fields for CustomFieldValue
}

export interface Customer {
    id: number;
    user_id: number;
    name: string;
    email: string;
    phone_number: string;
    custom_fields_values: CustomerCustomFieldValue[];
    notes: Note[];
    products: Product[]; // Add this line

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
    user_id: number;
    name: string;
    description: string;
}

export interface ProductCustomFieldValue {
    id?: number;  // Making it optional
    customer_id?: number;  // Making it optional
    custom_field?: any;  // Making it optional
    field_id: number;
    value: any;
    // ... any other fields for CustomFieldValue
}

export interface ProductCustomField {
    id: number;
    user_id: number;
    field_name: string;
    field_type: string;
    created_at: Date;
    // ... any other fields for CustomFieldValue
}

export interface Product {
    id: number;
    category_name: string;
    name: string;
    description: string;
    price: number;
    sku: string | null;
    inventory_count: number;
    category_id?: number; // Add this line if category_id exists for a product
    custom_fields_values: ProductCustomFieldValue[];
    category: Category;
}

export interface Inventory {
    id: number;
    user_id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    min_stock_level: number;
    max_stock_level: number;
    stock_status: string;
    restock_date?: string | null;
    product: Product;
}

interface CalendarEvent {
    id: number;
    title: string;
    description: string;
    start: Date;
    end: Date;
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
        products: PaginatedResponse<Product>;
        notes: Note[];
        customer_notes:Note[];
        customer_profile:Customer[];
        /* products:Product[]; */
        categories:Category[];
        inventories:Inventory[];
        customer_custom_fields: CustomerCustomField[];
        product_custom_fields: ProductCustomField[];
        calendar: CalendarEvent[];
    };
};
