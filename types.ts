import { AppUser } from './redux/auth/authSlide';

import { MapViewDirectionsMode } from 'react-native-maps-directions';

export interface Theme {
    mode: 'dark' | 'light';
    BACKGROUND_COLOR: string;
    TEXT_COLOR: string;
    BUTTON_TEXT_COLOR: string;
    PRIMARY_BUTTON_COLOR: string;
    SHADOW_COLOR: string;
    ASCENT: string;
    CARD_BACKGROUND: string;
    SECONDARY_BUTTON_COLOR: string;
    STATUS_BAR?: 'dark' | 'light';
    WHITE_COLOR: string;
    DANGER: string;
}

export interface ConnectedAccountParams {
    businessName: string;
    phone: string;
    address?: string;
    name: string;
    lastName: string;
    type: 'business' | 'courier';
}

interface Day {
    openAt: string;
    closeAt: string;
}
export interface BusinessDay {
    [key: string]: Day;
}

export interface Courier extends AppUser {
    transportation?: MapViewDirectionsMode;
    image: string | null;
    stripeAccount: string | null;
    isOnline: boolean;
    isActive: boolean;
}

export const DAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

export enum NOTIFICATION_TYPE {
    new_message = 'new message',
    closed = 'closed',
    new_referral = 'new_referral',
    reminder = 'reminder',
    ready_for_delivery = 'ready_for_delivery'
}
