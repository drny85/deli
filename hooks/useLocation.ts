import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const LOCATION_TASK_NAME = 'background-location-task';
export const useLocation = () => {
   const [status, requestPermission] = Location.useBackgroundPermissions();
   const [location, setLocation] = useState<LocationObject | null>(null);
   const [errorMsg, setErrorMsg] = useState<string | null>(null);
   console.log('STATUS', status);

   useEffect(() => {
      (async () => {
         try {
            let { status: STATUS } =
               await Location.requestForegroundPermissionsAsync();
            if (STATUS !== 'granted') {
               setErrorMsg('Permission to access location was denied');
               return;
            }
            // const { granted, canAskAgain } = await requestPermission();
            // if (!granted) {
            //    setErrorMsg(
            //       'Permission to access background location was denied'
            //    );
            // } else if (canAskAgain) {
            //    await requestPermission();
            // } else {
            //    return;
            // }

            // if (granted) {
            //    await startBackgroundLocation();
            // }

            let location = await Location.getCurrentPositionAsync({
               accuracy: Location.Accuracy.Balanced
            });
            let { coords } = await Location.getCurrentPositionAsync({});
            const { longitude, latitude } = coords;

            let address = await Location.reverseGeocodeAsync({
               longitude,
               latitude
            });

            setLocation(location);
         } catch (error) {
            console.log('ERROR', error);
         }
      })();
   }, []);
};

const startBackgroundLocation = async () => {
   try {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
         activityType: Location.LocationActivityType.AutomotiveNavigation,
         showsBackgroundLocationIndicator: true,
         accuracy: Location.Accuracy.BestForNavigation,
         deferredUpdatesInterval: 2000,
         deferredUpdatesDistance: 20,
         mayShowUserSettingsDialog: true,
         foregroundService: {
            notificationTitle: 'Location Access',
            notificationBody: 'Location access has been granted'
         }
      }).then(() => {
         Alert.alert('Turn on', 'runing', [
            { text: 'OK', onPress: () => console.log('listening gps') }
         ]);
      });
   } catch (error) {
      console.log('ERROR', error);
   }
};
