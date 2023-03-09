import { ExpoConfig } from 'expo/config';

// In SDK 46 and lower, use the following import instead:
// import { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
    name: 'deli',
    slug: 'deli',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',

    splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#001d3d'
    },
    updates: {
        fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,

        bundleIdentifier: 'net.robertdev.deli.app',

        infoPlist: {
            NSLocationUsageDescription:
                'We need access to your location to provide business location services',

            NSLocationWhenInUseUsageDescription:
                'The Beep App uses your location to pick origins, destinations, and predict ride times',

            NSLocationAlwaysAndWhenInUseUsageDescription:
                'The Beep App uses your location to pick origins, destinations, and predict ride times',

            UIBackgroundModes: ['location', 'fetch']
        }
    },

    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#FFFFFF'
        },
        permissions: ['ACCESS_BACKGROUND_LOCATION'],
        versionCode: 1,
        package: 'net.robertdev.deli.app'
    },
    plugins: [
        [
            'expo-image-picker',
            {
                photosPermission:
                    'The app accesses your photos to use them for the products'
            }
        ],
        [
            '@stripe/stripe-react-native',
            {
                merchantIdentifier: ['merchant.net.robertdev.deli.app'],
                enableGooglePay: true
            }
        ]
    ],
    extra: {
        eas: {
            projectId: 'c24913ab-c7a8-44e4-8a67-9a6bc200570f'
        }
    }
};

export default config;
