import { NavigatorScreenParams } from '@react-navigation/native';

import { AdminBottomTabScreens } from './admin/typing';
import { BusinessnBottomTabScreens } from './business/typing';
import { ConsumerBottomTabScreens } from './consumer/typing';

declare global {
    namespace ReactNavigation {
        interface RootParamList extends AllParams {}
    }
}

export type AllParams = BusinessnBottomTabScreens &
    AdminBottomTabScreens &
    ConsumerBottomTabScreens;
