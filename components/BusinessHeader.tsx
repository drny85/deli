import {
    ImageBackground,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import React, { useCallback } from 'react';

import Text from './Text';
import { IMAGE_PLACEHOLDER, SIZES } from '../constants';
import Row from './Row';
import { AnimatePresence, MotiView } from 'moti';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Business } from '../redux/business/businessSlide';
import { LinearGradient } from 'expo-linear-gradient';
import { updateUser } from '../redux/auth/authActions';
import { setUserData } from '../redux/auth/authSlide';
import Communications from 'react-native-communications';

type Props = {
    business: Business;
};

const BusinessHeader = ({ business }: Props) => {
    const { quantity } = useAppSelector((state) => state.cart);
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const callRestaurant = async (phone: string) => {
        try {
            Communications.phonecall(phone.replace(/-/g, ''), true);
        } catch (error) {
            const err = error as any;
            console.log(err.message);
        }
    };

    const theme = useAppSelector((state) => state.theme);
    const toggleFavorite = useCallback(async () => {
        try {
            let favoritesStores: string[] = [...user?.favoritesStores!];
            const index = user?.favoritesStores.findIndex(
                (id) => id === business.id
            );

            const isFavorite = index !== -1;
            if (isFavorite) {
                favoritesStores = [
                    ...favoritesStores.filter((f) => f !== business.id)
                ];
            } else {
                if (user?.favoritesStores !== undefined) {
                    favoritesStores = [...favoritesStores, business.id!];
                } else {
                    favoritesStores = [business.id!];
                }
            }

            await dispatch(updateUser({ ...user!, favoritesStores }));
            dispatch(setUserData({ ...user!, favoritesStores }));
        } catch (error) {
            console.log(error);
        }
    }, [user]);
    return (
        <>
            <ImageBackground
                source={{
                    uri: business.image ? business.image : IMAGE_PLACEHOLDER
                }}
                style={styles.image}
            ></ImageBackground>
            <View
                style={{
                    position: 'absolute',
                    top: SIZES.statusBarHeight,
                    zIndex: 600,
                    width: '100%'
                }}
            >
                <Row
                    containerStyle={{ marginHorizontal: SIZES.padding }}
                    horizontalAlign="space-between"
                >
                    <TouchableOpacity
                        style={{ padding: SIZES.base }}
                        onPress={() => navigation.goBack()}
                    >
                        <FontAwesome
                            name="chevron-left"
                            size={24}
                            color={theme.TEXT_COLOR}
                        />
                    </TouchableOpacity>
                    <Text large lobster>
                        {business?.name}
                    </Text>
                    <AnimatePresence>
                        {true && (
                            <MotiView
                                from={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ type: 'timing' }}
                            >
                                <Row>
                                    {user && (
                                        <TouchableOpacity
                                            style={[
                                                styles.rightIcon,
                                                {
                                                    backgroundColor:
                                                        theme.BACKGROUND_COLOR,
                                                    shadowColor:
                                                        theme.SHADOW_COLOR,
                                                    marginHorizontal:
                                                        SIZES.padding
                                                }
                                            ]}
                                            onPress={toggleFavorite}
                                        >
                                            <MotiView
                                                transition={{
                                                    type: 'timing',
                                                    duration: 300,
                                                    repeat: 3
                                                }}
                                                from={{
                                                    opacity: 0,
                                                    scale: 0
                                                }}
                                                animate={{
                                                    scale:
                                                        user.favoritesStores &&
                                                        user.favoritesStores.findIndex(
                                                            (i) =>
                                                                i ===
                                                                business.id
                                                        ) !== -1
                                                            ? [1, 1.2, 1]
                                                            : 1,
                                                    opacity: 1
                                                }}
                                            >
                                                <FontAwesome
                                                    name={
                                                        user.favoritesStores &&
                                                        user.favoritesStores.findIndex(
                                                            (i) =>
                                                                i ===
                                                                business.id
                                                        ) !== -1
                                                            ? 'heart'
                                                            : 'heart-o'
                                                    }
                                                    size={24}
                                                    color={'red'}
                                                />
                                            </MotiView>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        style={[
                                            styles.rightIcon,
                                            {
                                                backgroundColor:
                                                    theme.BACKGROUND_COLOR,
                                                shadowColor: theme.SHADOW_COLOR
                                            }
                                        ]}
                                        onPress={() => {
                                            navigation.navigate(
                                                'ConsumerCart',
                                                {
                                                    screen: 'Cart'
                                                }
                                            );
                                        }}
                                    >
                                        <FontAwesome
                                            name="shopping-cart"
                                            size={24}
                                            color={theme.TEXT_COLOR}
                                        />
                                        <MotiView
                                            transition={{
                                                type: 'timing',
                                                duration: 800,
                                                delay: 1000
                                            }}
                                            animate={{
                                                scale:
                                                    quantity > 0
                                                        ? [1, 1.1, 1]
                                                        : 1
                                            }}
                                            style={[
                                                styles.qty,
                                                {
                                                    backgroundColor:
                                                        theme.ASCENT
                                                }
                                            ]}
                                        >
                                            <Text lightText bold>
                                                {quantity}
                                            </Text>
                                        </MotiView>
                                    </TouchableOpacity>
                                </Row>
                            </MotiView>
                        )}
                    </AnimatePresence>
                </Row>
            </View>
            <LinearGradient
                start={{ x: 0.5, y: 0.5 }}
                end={{ x: 0.3, y: 0.9 }}
                style={[styles.name]}
                locations={[0.2, 0.6, 0.9]}
                colors={[
                    'rgba(0,0,0,0.2)',
                    'rgba(0,0,0,0.4)',
                    'rgba(0,0,0,0.6)'
                ]}
            >
                <Row horizontalAlign="space-between">
                    <Text lobster lightText medium>
                        {business.name}
                    </Text>
                    <TouchableOpacity
                        onPress={() => callRestaurant(business.phone!)}
                    >
                        <Text bold lightText>
                            {business.phone}
                        </Text>
                    </TouchableOpacity>
                </Row>

                <Text bold lightText>
                    {business.address?.split(',')[0]}
                </Text>

                <Row horizontalAlign="space-between">
                    <Text lightText raleway_italic>
                        {business.minimumDelivery &&
                            `$${business.minimumDelivery} minimum delivery`}
                    </Text>
                    <Text lightText raleway_italic>
                        {business.eta
                            ? `ETA ${business.eta} - ${business.eta + 5} mins`
                            : ''}
                    </Text>
                </Row>

                {!business.isOpen && (
                    <Text lightText raleway_italic>
                        Closed
                    </Text>
                )}
            </LinearGradient>
        </>
    );
};

export default BusinessHeader;

const styles = StyleSheet.create({
    rightIcon: {
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 3, height: 3 },
        elevation: 4,
        shadowOpacity: 0.3,
        shadowRadius: 4
    },
    qty: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -2,
        right: -2,
        zIndex: 10
    },
    name: {
        position: 'absolute',
        zIndex: 602,
        height: SIZES.height * 0.08,
        top: (SIZES.height * 0.2) / 2 + SIZES.height * 0.02,
        padding: SIZES.base,
        width: '100%'
    },
    image: {
        height: SIZES.height * 0.2,
        width: '100%',
        opacity: 0.4
    }
});
