import {
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import React from 'react';
import Text from '../../components/Text';
import Header from '../Header';
import Divider from '../Divider';
import Stack from '../Stack';
import { useAppSelector } from '../../redux/store';
import { FontAwesome } from '@expo/vector-icons';
import { Business } from '../../redux/business/businessSlide';
import {
    Order,
    ORDER_STATUS,
    ORDER_TYPE
} from '../../redux/consumer/ordersSlide';
import moment from 'moment';
import { SIZES } from '../../constants';
import ProductListItem from '../ProductListItem';
import Row from '../Row';
import { stripeFee } from '../../utils/stripeFee';

type Props = {
    visible: boolean;
    setVisible: (value: boolean) => void;
    businesses: Business[];
    order: Order;
};

const HomeBusinessOrderDetails = ({
    visible,
    setVisible,
    businesses,
    order
}: Props) => {
    const theme = useAppSelector((state) => state.theme);
    return (
        <Modal
            visible={visible}
            presentationStyle="pageSheet"
            animationType="slide"
            style={{ backgroundColor: theme.BACKGROUND_COLOR }}
        >
            <View
                style={[
                    styles.container,
                    { backgroundColor: theme.BACKGROUND_COLOR }
                ]}
            >
                <View
                    style={{
                        position: 'absolute',
                        top: 20,
                        width: '100%',
                        zIndex: 400,
                        backgroundColor: theme.BACKGROUND_COLOR
                    }}
                >
                    <Header
                        title="Order Details"
                        rightIcon={
                            <TouchableOpacity
                                onPress={() => setVisible(false)}
                                style={{
                                    padding: 10
                                }}
                            >
                                <FontAwesome
                                    name="close"
                                    color={theme.TEXT_COLOR}
                                    size={20}
                                />
                            </TouchableOpacity>
                        }
                    />
                </View>

                <View>
                    <Stack containerStyle={{ marginTop: 30 }}>
                        <Divider bgColor={theme.TEXT_COLOR} />
                        <Text bold>
                            From{' '}
                            <Text lobster medium>
                                {' '}
                                {
                                    businesses.find(
                                        (b) => b.id === order?.businessId
                                    )?.name
                                }
                            </Text>
                        </Text>
                        <Text>
                            {businesses.find(
                                (b) => b.id! === order?.businessId!
                            ) !== undefined
                                ? businesses
                                      .find((b) => b.id! === order?.businessId!)
                                      ?.address?.slice(0, -15)
                                : ''}
                        </Text>
                        <View style={{ height: 10 }} />
                        <Text bold>
                            To{' '}
                            <Text lobster medium>
                                {order?.contactPerson.name}
                            </Text>
                        </Text>
                        <Text>{order?.address?.street?.split(', ')[0]}</Text>
                        <Text py_4>
                            Order Date: {moment(order?.orderDate).format('lll')}
                        </Text>
                        <Text>
                            Order Type:{' '}
                            {order.orderType === ORDER_TYPE.delivery
                                ? 'Delivery'
                                : 'Pick Up'}
                        </Text>
                        {order?.status === ORDER_STATUS.delivered && (
                            <Text py_4>
                                Delivered On:{' '}
                                {moment(order?.deliveredOn).format('lll')}
                            </Text>
                        )}
                    </Stack>
                    <Divider
                        thickness="medium"
                        bgColor={theme.TEXT_COLOR}
                        small
                    />
                    <View style={{ padding: SIZES.padding }}>
                        <Text center bold>
                            Items
                        </Text>
                        <ScrollView contentContainerStyle={{ maxHeight: 200 }}>
                            {order?.items.map((item, index) => (
                                <ProductListItem
                                    key={index.toString()}
                                    item={item}
                                    index={index}
                                />
                            ))}
                        </ScrollView>

                        <Divider
                            thickness="medium"
                            bgColor={theme.TEXT_COLOR}
                            small
                        />

                        <View style={{ marginTop: 10 }}>
                            <Row
                                containerStyle={{ width: '100%' }}
                                horizontalAlign="space-between"
                            >
                                <Text capitalize>Sub Total</Text>
                                <Text capitalize>
                                    ${order?.total.toFixed(2)}
                                </Text>
                            </Row>
                            <Row
                                containerStyle={{ width: '100%' }}
                                horizontalAlign="space-between"
                            >
                                <Text py_4 capitalize>
                                    Service Fee
                                </Text>
                                <Text capitalize>
                                    ${stripeFee(order?.total!).toFixed(2)}
                                </Text>
                            </Row>
                            <Row
                                containerStyle={{ width: '100%' }}
                                horizontalAlign="space-between"
                            >
                                <Text capitalize>Tips</Text>
                                <Text capitalize>
                                    $ {order.tip?.amount.toFixed(2)}
                                </Text>
                            </Row>
                            <Divider small />
                            <Row
                                containerStyle={{ width: '100%' }}
                                horizontalAlign="space-between"
                            >
                                <Text py_4 bold large capitalize>
                                    Total
                                </Text>
                                <Text bold large capitalize>
                                    $
                                    {(
                                        order?.total! +
                                        order.tip?.amount! +
                                        stripeFee(order?.total!)
                                    ).toFixed(2)}
                                </Text>
                            </Row>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default HomeBusinessOrderDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingTop: SIZES.padding
    }
});
