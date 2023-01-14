import {
    ImageBackground,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import React from 'react';

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
import { AppUser } from '../redux/auth/authSlide';

type Props = {
    business: Business;
};

const BusinessHeader = ({ business }: Props) => {
    const { quantity } = useAppSelector((state) => state.cart);
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const theme = useAppSelector((state) => state.theme);
    const toggleFavorite = async () => {
        try {
            console.log(user?.favoritesStores);
        } catch (error) {
            console.log(error);
        }
    };
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
                        {quantity > 0 && (
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
                                                    duration: 300
                                                }}
                                                from={{ opacity: 0, scale: 1 }}
                                                animate={{
                                                    scale: 1,
                                                    opacity: 1
                                                }}
                                            >
                                                <FontAwesome
                                                    name="heart"
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
                    {quantity === 0 && <View />}
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
                <Text lobster lightText medium>
                    {business.name}
                </Text>
                <Text bold lightText>
                    {business.address?.split(',')[0]}
                </Text>
                <Text lightText raleway_italic>
                    {business.minimumDelivery &&
                        `$${business.minimumDelivery} minimum delivery`}
                </Text>
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
