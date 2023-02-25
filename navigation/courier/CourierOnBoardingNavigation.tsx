import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CourierEmailVerification from '../../screens/courier/onboarding/CourierEmailVerification';
import CourierOnboardingSuccess from '../../screens/courier/onboarding/CourierOnboardingSuccess';
import CourierPictureScreen from '../../screens/courier/onboarding/CourierPictureScreen';
import CourierStripeAccountScreen from '../../screens/courier/onboarding/CourierStripeAcountScreen';

import { CourierOnBoardingScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<CourierOnBoardingScreens>();

const CourierOnBoarding = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen
                name="CourierEmailVerification"
                component={CourierEmailVerification}
            />
            <Screen
                name="CourierStripeAccountCreation"
                component={CourierStripeAccountScreen}
            />
            <Screen
                name="CourierOnBoardingSuccess"
                component={CourierOnboardingSuccess}
            />
            <Screen
                name="CourierPictureScreen"
                component={CourierPictureScreen}
            />
        </Navigator>
    );
};

export default CourierOnBoarding;
