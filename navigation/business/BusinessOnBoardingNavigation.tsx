import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BusinessCreatedSuccessfull from '../../screens/business/onboarding/BusinessCreatedSuccessfull';
import BusinessInformation from '../../screens/business/onboarding/BusinessInformation';
import BusinessStripeAccountCreation from '../../screens/business/onboarding/BusinessStripeAccountCreation';
import EmailVerification from '../../screens/business/onboarding/EmailVerification';
import { BusinessOnBoardingStackScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<BusinessOnBoardingStackScreens>();

const BusinessOnBoardingNavigation = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="EmailVerification" component={EmailVerification} />
            <Screen
                name="BusinessInformation"
                component={BusinessInformation}
            />
            <Screen
                name="BusinessStripeAccountCreation"
                component={BusinessStripeAccountCreation}
            />
            <Screen
                name="BusinessCreatedSuccesfull"
                component={BusinessCreatedSuccessfull}
            />
        </Navigator>
    );
};

export default BusinessOnBoardingNavigation;
