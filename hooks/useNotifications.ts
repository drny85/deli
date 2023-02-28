import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import * as Device from 'expo-device';
import {
    useNavigation,
    getPathFromState,
    NavigationState
} from '@react-navigation/native';

import { db } from '../firebase';
import { useAppSelector } from '../redux/store';
import { doc, setDoc } from '@firebase/firestore';
import { NOTIFICATION_TYPE } from '../types';

interface NotiType {
    id: string | null;
    notificationType: NOTIFICATION_TYPE;
}
Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
        const { data } = notification.request.content;
        console.log(notification.date);

        return {
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false
        };
    }
});

const useNotifications = () => {
    const navigation = useNavigation();

    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!user) return;

        registerForPushNotificationsAsync();

        notificationListener.current =
            Notifications.addNotificationReceivedListener(
                (notification: Notifications.Notification) => {
                    const { data } = notification.request.content;

                    const result = data as any;
                    const { id, notificationType } = result as NotiType;

                    //ACTIONS WHEN USER RECEIVES NOTIFICATION
                }
            );

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response: Notifications.NotificationResponse) => {
                    const { content } = response.notification.request;
                    const data = content.data as any;
                    const { id, notificationType } = data as NotiType;

                    //ACTIONS WHEN USER CLICK ON NOTIFICATION
                }
            );

        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current
            );
            Notifications.removeNotificationSubscription(
                responseListener.current
            );
        };
    }, [user]);

    const registerForPushNotificationsAsync = async () => {
        try {
            if (Device.isDevice) {
                const { status: existingStatus } =
                    await Notifications.requestPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } =
                        await Notifications.getPermissionsAsync();
                    finalStatus = status;
                }

                if (finalStatus !== 'granted') {
                    const { canAskAgain } =
                        await Notifications.getPermissionsAsync();
                    if (canAskAgain) {
                        const { status } =
                            await Notifications.requestPermissionsAsync();
                        finalStatus = status;
                    }

                    console.log('Not Granted');
                    // Alert.alert(
                    // 	'Error',
                    // 	'Failed to get push token for push notification!',
                    // 	[{ text: 'OK', style: 'cancel' }]
                    // );
                    return;
                }
                const token = (
                    await Notifications.getExpoPushTokenAsync({
                        experienceId: 'deli'
                    })
                ).data;

                if (user?.pushToken) return;

                const userRef = doc(db, `users/${user?.id}`);
                await setDoc(userRef, { pushToken: token }, { merge: true });

                if (Platform.OS === 'android') {
                    Notifications.setNotificationChannelAsync('default', {
                        name: 'default',
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: '#FF231F7C'
                    });
                }
            }
        } catch (error) {
            const err = error as any;
            console.log('Error from useNotifications hooks', err.message);
        }
    };
};

export default useNotifications;
