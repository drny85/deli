import { Image, TouchableOpacity } from 'react-native';
import React from 'react';

import Text from '../../components/Text';
import { Courier } from '../../types';
import Stack from '../Stack';
import Row from '../Row';
import { SIZES } from '../../constants';
import { useAppSelector } from '../../redux/store';
import Communications from 'react-native-communications';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
    courier: Courier;
    phone?: string;
};

const CourierCard = ({ courier, phone }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const { user } = useAppSelector((state) => state.auth);
    const makeCall = async (phone: string) => {
        try {
            Communications.phonecall(phone.replace(/-/g, ''), true);
        } catch (error) {
            const err = error as any;
            console.log(err.message);
        }
    };

    return (
        <Stack
            py={2}
            center
            containerStyle={{
                borderRadius: SIZES.radius,
                shadowColor: theme.SHADOW_COLOR,
                elevation: 6,
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: 0.6,
                shadowRadius: 6,
                backgroundColor: theme.BACKGROUND_COLOR
            }}
        >
            <Row
                containerStyle={{ width: '100%' }}
                horizontalAlign="space-evenly"
            >
                <Image
                    resizeMode="contain"
                    style={{ height: 60, width: 60, borderRadius: 30 }}
                    source={{
                        uri:
                            courier.image ||
                            'https://png.pngtree.com/png-clipart/20210606/original/pngtree-gray-avatar-placeholder-png-image_6398267.jpg'
                    }}
                />
                <Stack>
                    <Text lobster large>
                        {courier.name}{' '}
                        {user?.type === 'business' && courier.lastName}
                    </Text>
                </Stack>
                <Stack>
                    <Text lobster>rating 5.0</Text>
                </Stack>
            </Row>
            {phone && (
                <Stack center py={1} px={1}>
                    <TouchableOpacity
                        style={{
                            borderRadius: SIZES.radius * 2,
                            borderColor: theme.ASCENT,
                            borderWidth: 0.5,
                            paddingVertical: SIZES.base,
                            paddingHorizontal: SIZES.padding
                        }}
                        onPress={() => makeCall(phone)}
                    >
                        <Row>
                            <FontAwesome
                                style={{ marginHorizontal: 6 }}
                                name="phone"
                                size={20}
                                color={theme.TEXT_COLOR}
                            />
                            <Text center>{phone}</Text>
                        </Row>
                    </TouchableOpacity>
                </Stack>
            )}
        </Stack>
    );
};

export default CourierCard;
12345;
