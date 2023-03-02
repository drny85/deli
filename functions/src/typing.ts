export interface Coors {
    lat: number;
    lng: number;
}

export interface UserPreferences {
    favoritesBusiness: string[];
}
export interface AppUser {
    id?: string;
    name: string;
    lastName: string;
    email: string;
    emailVerified: boolean;
    phone: string | null;
    type: 'admin' | 'business' | 'consumer' | 'courier';
    preferences?: UserPreferences;
    pushToken?: string;
    coors?: Coors;
    transportation?: MapViewDirectionsMode;
    favoritesStores: string[];
    deliveryAddresses: Order['address'][];
}
export interface hour {
    [key: string]: string;
}
export interface P_Size {
    id: string;
    size: string;
    price: number;
}

export interface CartItem extends Product {
    quantity: number;
    size: P_Size | null;
    instructions: string;
}

export interface Category {
    id?: string;
    name: string;
}
export interface Product {
    id?: string;
    name: string;
    category: Category | null;
    price: string | number;
    image: string | null;
    description: string | null;
    sizes: P_Size[];
    businessId: string;
    unitSold: number;
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
    hours: BusinessDay | null;
    charges_enabled: boolean;
    milesRadius: number | null;
    minimumDelivery: number | null;
    orderType?: BUSINESS_ORDER_TYPE;
    isOpen: boolean;
    distance?: number | null;
    eta?: number;
    zips: number[];
}
export interface Tip {
    amount: number;
    percentage: number;
}
export enum BUSINESS_ORDER_TYPE {
    deliveryOnly = 'deliveryOnly',
    both = 'both'
}
export interface BusinessDay {
    [key: string]: Day;
}

interface Day {
    openAt: string;
    closeAt: string;
}

export interface Order {
    id?: string;
    orderNumber?: number;
    total: number;
    items: CartItem[];
    paymentIntent: string;
    orderDate: string;
    userId: string;
    businessId: string;
    contactPerson: ContactPerson;
    orderType: ORDER_TYPE;
    deliveryInstructions: string | null;
    address: OrderAddress | null;
    status: ORDER_STATUS;
    courier?: Courier | null;
    deliveredOn?: string | null;
    deliveredBy?: AppUser | null;
    pickedUpOn?: string | null;
    acceptedOn?: string | null;
    tip?: Tip;
    deliveryPaid: boolean;
    transferId: string | null;
}
export enum ORDER_TYPE {
    pickup = 'pickup',
    delivery = 'delivery'
}
export interface OrderAddress {
    street: string;
    apt?: string;
    coors: Coors;
    addedOn: string;
}

export interface ContactPerson {
    name: string;
    lastName: string;
    phone: string;
}

export enum ORDER_STATUS {
    delivered = 'delivered',
    in_progress = 'in_progress',
    new = 'new',
    marked_ready_for_delivery = 'marked_ready_for_delivery',
    marked_ready_for_pickup = 'marked_ready_for_pickup',
    cancelled = 'cancelled',
    accepted_by_driver = 'accepted_by_driver',
    all = 'all orders',
    picked_up_by_driver = 'picked_up_by_driver',
    picked_up_by_client = 'picked_up_by_client'
}

export interface Courier extends AppUser {
    transportation?: MapViewDirectionsMode;
    image?: string;
    stripeAccount: string | null;
    isOnline: boolean;
    isActive: boolean;
}

export enum NOTIFICATION_TYPE {
    new_order = 'new order',
    ready_for_delivery = 'ready_for_delivery'
}

export type MapViewDirectionsMode =
    | 'DRIVING'
    | 'BICYCLING'
    | 'TRANSIT'
    | 'WALKING';
