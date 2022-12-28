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
