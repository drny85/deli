import { NavigatorScreenParams } from '@react-navigation/native';
import { ConsumerProfileStackScreens } from '../consumer/typing';

export type AuthScreens = {
    Login: undefined;
    Signup: undefined;
    BusinessSignup: undefined;
    EmailVerification: { email: string };
    CourierSignup: undefined;
    ForgotPassword: { email: string } | undefined;
};
