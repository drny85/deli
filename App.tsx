import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';

import { ThemeProvider } from 'styled-components/native';
import store, { useAppSelector } from './redux/store';

import useCachedResources from './hooks/useInit';
import Loader from './components/Loader';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AdminBottomTabs from './navigation/admin/AdminBottomTabs';
import BusinessBottomTabs from './navigation/business/BusinessBottomTabs';
import BusinessOnBoardingNavigation from './navigation/business/BusinessOnBoardingNavigation';
import ConsumerBottomTabs from './navigation/consumer/ConsumerBottomTabs';
import { LOCATION_TASK_NAME } from './hooks/useLocation';

const App = () => {
   const isReady = useCachedResources();
   const theme = useAppSelector((state) => state.theme);
   const [processing, setProcessing] = useState(true);
   const { user, loading } = useAppSelector((state) => state.auth);
   const { business, loading: businessLoading } = useAppSelector(
      (state) => state.business
   );
   useEffect(() => {
      if (isReady && !loading && !businessLoading) {
         setProcessing(false);
      } else {
         setProcessing(true);
      }
   }, [isReady, loading, businessLoading]);

   // console.log('PROS', processing);
   if (processing) return <Loader />;
   return (
      <ThemeProvider theme={theme}>
         <NavigationContainer
            theme={{
               ...DefaultTheme,
               colors: {
                  ...DefaultTheme.colors,
                  primary: theme.PRIMARY_BUTTON_COLOR,
                  background: theme.BACKGROUND_COLOR
               }
            }}
         >
            {user && user.type === 'admin' ? (
               <AdminBottomTabs />
            ) : user &&
              user.type === 'business' &&
              business &&
              business.profileCompleted ? (
               <BusinessBottomTabs />
            ) : user &&
              user.type === 'business' &&
              business &&
              business.stripeAccount === null ? (
               <BusinessOnBoardingNavigation />
            ) : (
               <ConsumerBottomTabs />
            )}

            <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
         </NavigationContainer>
      </ThemeProvider>
   );
};

export default () => {
   return (
      <Provider store={store}>
         <App />
      </Provider>
   );
};
