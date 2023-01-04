import {
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import React from 'react';
import Text from './Text';
import { SIZES } from '../constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Business } from '../redux/business/businessSlide';

type Props = {
    business: Business;
    onPress: () => void;
};

const BusinessCard = ({ business, onPress }: Props) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container]}>
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
            </ImageBackground>
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
