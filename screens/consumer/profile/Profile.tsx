import {
    Alert,
    ListRenderItem,
    View,
    Animated,
    TouchableOpacity
} from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import Loader from '../../../components/Loader';

import AuthNavigationStack from '../../../navigation/auth/AuthNavigationStack';
import Divider from '../../../components/Divider';
import Button from '../../../components/Button';
import { logoutUser } from '../../../redux/auth/authActions';
import Header from '../../../components/Header';
import { FontAwesome } from '@expo/vector-icons';

type Props = {};

const Profile = ({}: Props) => {
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
    if (!user) return <AuthNavigationStack />;
    return (
        <Screen>
            <Header
                title={`Hi ${user.name}`}
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
