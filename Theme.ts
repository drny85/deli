import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
    mode: 'light',
    BACKGROUND_COLOR: '#ffffff',
    TEXT_COLOR: '#212121',
    BUTTON_TEXT_COLOR: '#ffffff',
    PRIMARY_BUTTON_COLOR: '#f8f9fa',
    SHADOW_COLOR: '#646262a6',
    ASCENT: '#2a9d8f', //A good color with white text always
    CARD_BACKGROUND: '#dad7cd',
    SECONDARY_BUTTON_COLOR: '#e0e1dd',
    WHITE_COLOR: '#ffffff',
    DANGER: '#e76f51'
};

export const darkTheme: DefaultTheme = {
    mode: 'dark',
    BACKGROUND_COLOR: '#001d3d',
    TEXT_COLOR: '#fff',
    BUTTON_TEXT_COLOR: '#ffffff',
    CARD_BACKGROUND: '#3a5a40',
    ASCENT: '#2a9d8f', //A good color with white text always #606c38
    PRIMARY_BUTTON_COLOR: '#10002b',
    SHADOW_COLOR: '#646262a6',
    SECONDARY_BUTTON_COLOR: '#457b9d',
    WHITE_COLOR: '#ffffff',
    DANGER: '#e76f51'
};
