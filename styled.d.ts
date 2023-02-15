// import original module declarations
import 'styled-components/native';

// and extend them!

declare module 'styled-components' {
    export interface DefaultTheme {
        mode: 'light' | 'dark';
        BACKGROUND_COLOR: string;
        TEXT_COLOR: string;
        BUTTON_TEXT_COLOR: string;
        PRIMARY_BUTTON_COLOR: string;
        ASCENT: string;
        SHADOW_COLOR: string;
        CARD_BACKGROUND: string;
        SECONDARY_BUTTON_COLOR: string;
        STATUS_BAR?: 'light' | 'dark';
        WHITE_COLOR: string;
        DANGER: string;
    }
}
