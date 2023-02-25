import { View } from 'react-native';
import React from 'react';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import { CourierStackScreens } from '../../navigation/courier/typing';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from '../../components/Header';
import { useAppSelector } from '../../redux/store';
import moment from 'moment';

type Props = NativeStackScreenProps<CourierStackScreens, 'DeliveryDetails'>;
const DeliveryDetails = ({
    navigation,
    route: {
        params: { order }
    }
}: Props) => {
    const theme = useAppSelector((state) => state.theme);
    return (
        <View
            style={{ backgroundColor: theme.BACKGROUND_COLOR, paddingTop: 20 }}
        >
            <Header
                title="Order Details"
                onPressBack={() => {
                    navigation.goBack();
                }}
            />
            <View>
                <Text center py_4 bold>
                    Order Date {moment(order.orderDate).format('lll')}
                </Text>
                <Text>
                    {moment(order.acceptedOn).diff(
                        moment(order.deliveredOn),
                        'minutes'
                    )}
                </Text>
            </View>
        </View>
    );
};

export default DeliveryDetails;
