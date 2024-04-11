export interface User {
    id: number;
    user_id: number | null;
    name: string;
    email: string;
    email_verified_at: string | null;
    is_active: boolean;
}

export interface SuperAdminUsers {
    id: number;
    user_id: number | null;
    name: string;
    email: string;
    email_verified_at: string | null;
    children?: User[];
    customers_count?: number;
    products_count?: number;
    is_active: boolean;
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
    orders: Order[];
    created_at: Date;

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
    description?: string;
    start: Date | string;
    end: Date | string;
    color?: string;
  }

  export interface Order {
    id: number;
    user_id: number; // Assuming this is the ID of the user who creates the order
    customer_id: number;
    total: number;
    status: string; // Could be an enum or string type depending on how you manage status
    order_items?: OrderItem[]; // Optional for when creating and not yet populated
    created_at?: Date;
}

export interface OrderItem {
    id?: number; // Optional as it might not exist before creation
    order_id: number;
    product_id: number;
    quantity: number;
    price: number; // Assuming this is the price at the time of order
    product?: Product; // Add this line to include product details
}

export interface Message {
    id: number;
    from_user_id: number;
    to_user_id: number;
    message: string;
    created_at: Date;
  }

  export interface DashboardData {
    customerCount: number;
    orderCount: number;
    productCount: number;
    totalSales: number;
    outOfStockCount: number;
    ordersByStatus: { [key: string]: number }; // Adding orders by status
    monthlySalesData: MonthlySalesData[]; // Define this based on the data structure
    productCountsByCategory: ProductCountByCategory[]; // Define this based on the data structure
}

// Assuming the monthly sales data includes year, month, and total sales
export interface MonthlySalesData {
    year: number;
    month: number;
    totalSales: number;
}

// Assuming product counts by category includes the category name and product count
export interface ProductCountByCategory {
    name: string;
    productCount: number;
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
        inventories: PaginatedResponse<Inventory>;
        notes: Note[];
        customer_notes:Note[];
        customer_profile:Customer[];
        /* products:Product[]; */
        categories:Category[];
        /* inventories:Inventory[]; */
        customer_custom_fields: CustomerCustomField[];
        product_custom_fields: ProductCustomField[];
        calendar: CalendarEvent[];

        orders: Order[];
        order_items: OrderItem[];


        superadminusers: SuperAdminUsers[];


        users: User[];
        messages: PaginatedResponse<Message>;

        dashboardData?: DashboardData; // Optional since it might not be available on all pages

    };
};
