export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export interface Customer {
    id: number;
    name: string;
    // ... any other fields for Customer
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        customers?: Customer[];
    };
};
