export interface Coors {
    lat: number;
    lng: number;
}

export interface AppUser {
    id?: string;
    name: string;
    lastName: string;
    email: string;
    emailVerified: boolean;
    type: 'admin' | 'business' | 'consumer';
}

export interface hour {
    [key: string]: string;
}

export interface Business {
    id?: string;
    name: string;
    email: string;
    owner: { name: string; lastName: string };
    stripeAccount: string | null;
    address: string | null;
    coors: Coors | null;
    phone: string | null;
    isActive: boolean;
    userId: string;
    profileCompleted: boolean;
    hasItems: boolean;
    image: string | null;
    hours: hour[] | null;
    charges_enabled: boolean;
    minimumDelivery: number | null;
    milesRadius: number | null;
}
