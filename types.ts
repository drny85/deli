import { Coors } from './redux/business/businessSlide';

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
}

export interface ConnectedAccountParams {
    businessName: string;
    phone: string;
    address: string;
    name: string;
    lastName: string;
}

export interface BusinessDay {
    [key: string]: { openAt: string; closeAt: string };
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
