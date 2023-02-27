import {
    FlatList,
    ListRenderItem,
    Modal,
    TouchableOpacity,
    View
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import Header from '../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '../../../redux/store';
import { useBusinessOrders } from '../../../hooks/useBusinessOrders';
import Loader from '../../../components/Loader';
import { Order, ORDER_STATUS } from '../../../redux/consumer/ordersSlide';
import { Theme } from '../../../types';
import Row from '../../../components/Row';
import { SIZES } from '../../../constants';
import { STATUS_NAME } from '../../../utils/orderStatus';
import moment from 'moment';
import Divider from '../../../components/Divider';
import RadioButton from '../../../components/RadioButton';
import InputField from '../../../components/InputField';

type Props = {};

const BusinessOrderListItem = ({
    order,
    theme,
    onPress
}: {
    order: Order;
    theme: Theme;
    onPress: () => void;
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                shadowOffset: { width: 5, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 6,
                elevation: 6,
                shadowColor: theme.SHADOW_COLOR,
                backgroundColor: theme.BACKGROUND_COLOR,
                padding: SIZES.padding
            }}
        >
            <Row horizontalAlign="space-between">
                <Text bold># {order.orderNumber}</Text>
                <Text bold>Status : {STATUS_NAME(order.status)}</Text>
                <Text bold>Date: {moment(order.orderDate).format('lll')}</Text>
            </Row>
            <Divider />
            <Row horizontalAlign="space-between">
                <View style={{ alignItems: 'flex-start', flexGrow: 1 }}>
                    <Text py_4>
                        Customer : {order.contactPerson.name}{' '}
                        {order.contactPerson.lastName}
                    </Text>
                    <Text left>
                        Address : {order.address?.street.slice(0, -13)}{' '}
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-start', flexGrow: 1 }}>
                    <Text left>Total ${order.total}</Text>
                    <Text left>
                        Items {order.items.reduce((a, b) => a + b.quantity, 0)}
                    </Text>
                </View>
            </Row>
        </TouchableOpacity>
    );
};

const OrderHistory = (props: Props) => {
    const navigation = useNavigation();
    const theme = useAppSelector((state) => state.theme);
    const [status, setStatus] = useState<ORDER_STATUS>();
    const { orders, loading } = useBusinessOrders();
    const [searchValue, setSearchValue] = useState('');

    const [data, setData] = useState<Order[]>([]);

    const [filtering, setFiltering] = useState(false);

    const onSearch = (value: string) => {
        setSearchValue(value);
        if (searchValue.length) {
            setData(
                orders.filter((order) => {
                    const regex = new RegExp(`${value.toLowerCase()}`, 'gi');

                    return (
                        order.contactPerson.name.toLowerCase().match(regex) ||
                        order.contactPerson.lastName
                            .toLowerCase()
                            .match(regex) ||
                        order.orderNumber?.toString().match(regex) ||
                        order.address?.street.toLowerCase().match(regex) ||
                        order.contactPerson.phone
                            .replace(/\D/g, '')
                            .match(regex)
                    );
                })
            );
        } else {
            setData(orders);
        }
    };

    const onStatusChange = () => {
        if (status !== undefined) {
            setData(orders.filter((order) => order.status === status));
        }
    };

    const renderOrders: ListRenderItem<Order> = ({ item }) => {
        return (
            <BusinessOrderListItem
                order={item}
                theme={theme}
                onPress={() => {
                    navigation.navigate('BusinessHome', {
                        screen: 'BusinessOrderDetails',
                        params: { orderId: item.id! }
                    });
                }}
            />
        );
    };

    useEffect(() => {
        if (orders.length === 0) return;
        setData(orders);
    }, [orders.length]);
    if (loading) return <Loader />;
    return (
        <Screen>
            <Header
                onPressBack={() => navigation.goBack()}
                title={'Orders History'}
                rightIcon={
                    <Row>
                        {(status !== undefined || searchValue.length > 0) && (
                            <TouchableOpacity
                                onPress={() => {
                                    setData(orders);
                                    setStatus(undefined);
                                    setSearchValue('');
                                }}
                            >
                                <Text raleway_bold px_4>
                                    Clear Filter
                                </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            onPress={() => setFiltering(true)}
                            style={{ paddingRight: 12 }}
                        >
                            <FontAwesome
                                name="filter"
                                color={theme.TEXT_COLOR}
                                size={24}
                            />
                        </TouchableOpacity>
                    </Row>
                }
            />
            <View style={{ alignSelf: 'center', width: '80%' }}>
                <InputField
                    p_y={10}
                    placeholder="Search Order By Customer's name, phone, address, etc"
                    value={searchValue}
                    onChangeText={(text) => onSearch(text)}
                    rightIcon={
                        searchValue.length > 0 ? (
                            <TouchableOpacity
                                onPress={() => {
                                    setSearchValue('');
                                    setData(orders);
                                }}
                                style={{ paddingHorizontal: SIZES.base }}
                            >
                                <FontAwesome
                                    name="close"
                                    size={16}
                                    color={theme.TEXT_COLOR}
                                />
                            </TouchableOpacity>
                        ) : undefined
                    }
                />
            </View>

            <View style={{ flex: 1 }}>
                {data.length > 0 ? (
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id!}
                        renderItem={renderOrders}
                    />
                ) : (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text large bold>
                            No Data
                        </Text>
                    </View>
                )}
            </View>

            <Modal
                visible={filtering}
                presentationStyle="formSheet"
                animationType="slide"
            >
                <View
                    style={{
                        flex: 1,
                        padding: SIZES.padding,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: theme.BACKGROUND_COLOR
                    }}
                >
                    <Header
                        onPressBack={() => {
                            setFiltering(false);
                        }}
                        containerStyle={{ width: '100%' }}
                        title="Filter By"
                        rightIcon={
                            <TouchableOpacity
                                style={{
                                    borderWidth: 0.5,
                                    borderColor: theme.ASCENT,
                                    padding: SIZES.base,
                                    borderRadius: SIZES.radius
                                }}
                                onPress={() => {
                                    onStatusChange();
                                    setFiltering(false);
                                }}
                            >
                                <Row>
                                    <Text bold px_4>
                                        Save
                                    </Text>
                                    <FontAwesome
                                        name="save"
                                        size={26}
                                        color={theme.TEXT_COLOR}
                                    />
                                </Row>
                            </TouchableOpacity>
                        }
                    />
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center'
                        }}
                    >
                        {removeDuplicates(orders).map((s, index) => (
                            <RadioButton
                                key={index}
                                status={s}
                                onPress={() => {
                                    setStatus(s);
                                    //onStatusChange(s);
                                    console.log(s);
                                    // setStatus(s);
                                }}
                                selected={s === status}
                            />
                        ))}
                    </View>
                </View>
            </Modal>
        </Screen>
    );
};

export default OrderHistory;

function removeDuplicates(arr: Order[]) {
    let unique: ORDER_STATUS[] = [];
    arr.forEach((element) => {
        if (!unique.includes(element.status)) {
            unique.push(element.status);
        }
    });
    return unique;
}
