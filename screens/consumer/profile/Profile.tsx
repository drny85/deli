import { Alert, View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import Loader from '../../../components/Loader';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthScreens } from '../../../navigation/auth/typing';
import AuthNavigationStack from '../../../navigation/auth/AuthNavigationStack';
import Divider from '../../../components/Divider';
import Button from '../../../components/Button';
import { logoutUser } from '../../../redux/auth/authActions';

type Props = {};

const Profile = ({}: Props) => {
    const { user, loading } = useAppSelector((state) => state.auth);
    console.log(user);
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
    if (!user) return <AuthNavigationStack />;
    return (
        <Screen center>
            <Text lobster large animation={'fadeInDown'} duration={1100}>
                Hi {user.name}
            </Text>
            <Divider />
            <Button title="Sign Out" onPress={handleLogout} />
        </Screen>
    );
};

export default Profile;
