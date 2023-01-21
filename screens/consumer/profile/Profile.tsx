import { Alert, ListRenderItem, View, Animated } from 'react-native';
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
import { Business } from '../../../redux/business/businessSlide';
import BusinessCard from '../../../components/business/BusinessCard';
import { useBusinessAvailable } from '../../../hooks/useBusinessAvailable';

type Props = {};

const Profile = ({}: Props) => {
    const { user, loading } = useAppSelector((state) => state.auth);
    const { businessAvailable } = useBusinessAvailable();
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

    const renderBusinesses: ListRenderItem<Business> = ({ item }) => {
        // return (
        //     <BusinessCard
        //         containerStyle={{ height: 200 }}
        //         business={item}
        //         onPress={() => {}}
        //     />
        return (
            <View
                style={{
                    width: '90%',
                    padding: 60,
                    backgroundColor: 'red',
                    height: '100%',
                    marginHorizontal: 12
                }}
            >
                <Text>{item.name}</Text>
            </View>
        );
    };
    if (loading) return <Loader />;
    if (!user) return <AuthNavigationStack />;
    return (
        <Screen>
            <Text lobster large animation={'fadeInDown'} duration={1100}>
                Hi {user.name}
            </Text>
            <Divider />
            <Button title="Sign Out" onPress={handleLogout} />
            <View style={{ height: 200, width: '100%' }}>
                <Animated.FlatList
                    data={businessAvailable}
                    pagingEnabled
                    style={{ flexGrow: 0 }}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        marginHorizontal: 15
                    }}
                    snapToAlignment={'center'}
                    horizontal
                    keyExtractor={(item) => item.id!}
                    renderItem={renderBusinesses}
                />
            </View>
        </Screen>
    );
};

export default Profile;
