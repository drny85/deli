import {
    ImageBackground,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import React from 'react';
import Text from '../Text';
import { SIZES } from '../../constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Business } from '../../redux/business/businessSlide';
import { AnimatePresence, MotiView } from 'moti';
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '../../redux/store';
import Row from '../Row';

type Props = {
    business: Business;
    onPress: () => void;
    containerStyle?: StyleProp<ViewStyle>;
};

const BusinessCard = ({ business, onPress, containerStyle }: Props) => {
    const { user } = useAppSelector((state) => state.auth);
    return (
        <TouchableOpacity
            disabled={!business.isOpen}
            onPress={onPress}
            style={[styles.container, containerStyle]}
        >
            <ImageBackground
                resizeMode="cover"
                style={[styles.image]}
                source={{
                    uri: business.image
                        ? business.image
                        : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80'
                }}
            >
                <LinearGradient
                    start={{ x: 0.2, y: 0.7 }}
                    end={{ x: 0.8, y: 0.4 }}
                    style={[styles.name]}
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
                    <Row horizontalAlign="space-between">
                        <Text lightText raleway_italic>
                            {business.minimumDelivery &&
                                `$${business.minimumDelivery} minimum delivery`}
                        </Text>
                        <Text lightText raleway_italic>
                            {business.eta
                                ? `ETA ${business.eta} - ${
                                      business.eta + 5
                                  } mins`
                                : ''}
                        </Text>
                    </Row>
                    {!business.isOpen && (
                        <Text lightText bold raleway_italic>
                            Closed
                        </Text>
                    )}
                </LinearGradient>
            </ImageBackground>
            <AnimatePresence>
                {user &&
                    user.favoritesStores &&
                    user?.favoritesStores.findIndex(
                        (i) => i === business.id
                    ) !== -1 && (
                        <MotiView
                            from={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: [1, 1.2, 1] }}
                            transition={{ type: 'timing', repeat: 3 }}
                            style={{ position: 'absolute', top: 10, right: 15 }}
                        >
                            <FontAwesome name="heart" size={20} color={'red'} />
                        </MotiView>
                    )}
            </AnimatePresence>
        </TouchableOpacity>
    );
};

export default BusinessCard;

const styles = StyleSheet.create({
    container: {
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        height: SIZES.height * 0.2,
        marginVertical: SIZES.base
    },
    name: {
        position: 'absolute',
        bottom: 0,
        padding: SIZES.base,
        width: '100%'
    },
    image: {
        width: '100%',
        height: '100%'
    }
});
