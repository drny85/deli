import { Alert, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';

import { useAppDispatch, useAppSelector } from '../../../redux/store';
import Loader from '../../../components/Loader';

import { logoutUser } from '../../../redux/auth/authActions';
import Header from '../../../components/Header';
import { FontAwesome } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ConsumerProfileStackScreens } from '../../../navigation/consumer/typing';
import Login from '../../auth/Login';

type Props = NativeStackScreenProps<ConsumerProfileStackScreens, 'Profile'>;

const Profile = ({ navigation }: Props) => {
    const { user, loading } = useAppSelector((state) => state.auth);
    const theme = useAppSelector((state) => state.theme);

    const dispatch = useAppDispatch();
    const handleLogout = () => {
        Alert.alert('Loging Out', 'Do you want to log/sign out?', [
            { text: 'No', style: 'cancel' },
            {
                text: 'Yes, exit',
                style: 'destructive',
                onPress: () => dispatch(logoutUser())
            }
        ]);
    };
    if (loading) return <Loader />;
    //if (!user) return <Login />;

    return (
        <Screen>
            <Header
                title={`Hi ${user?.name}`}
                rightIcon={
                    <TouchableOpacity
                        style={{ marginRight: 8 }}
                        onPress={handleLogout}
                    >
                        <FontAwesome
                            name="sign-out"
                            size={30}
                            color={theme.TEXT_COLOR}
                        />
                    </TouchableOpacity>
                }
            />
        </Screen>
    );
};

export default Profile;
