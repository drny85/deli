import { View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import Row from './Row';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { setGrandTotal, setTipAmount } from '../redux/consumer/ordersSlide';
import { SIZES } from '../constants';
import { stripeFee } from '../utils/stripeFee';
import Text from './Text';
import Stack from './Stack';

type Props = {
    customTip: string;
    setCustomTip: (value: string) => void;
    setShowCustomTip: (value: boolean) => void;
    containerStyle?: StyleProp<ViewStyle>;
};

const CustomTip = ({
    customTip,
    setCustomTip,
    setShowCustomTip,
    containerStyle
}: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const { total } = useAppSelector((state) => state.cart);
    const { orderType } = useAppSelector((state) => state.orders);
    const {
        tip: { percentage, amount }
    } = useAppSelector((state) => state.orders);
    const dispatch = useAppDispatch();
    return (
        <View style={containerStyle}>
            <Stack
                py={6}
                containerStyle={{
                    width: '100%',
                    paddingHorizontal: 6
                    //alignSelf: 'center'
                }}
            >
                <Row
                    containerStyle={{
                        width: '100%',
                        marginVertical: SIZES.base
                    }}
                    horizontalAlign="space-between"
                >
                    <Text bold>Add a tip for your driver</Text>
                    <Text>
                        {!customTip && percentage + '% '}

                        <Text bold px_6>
                            ${customTip ? customTip : amount.toFixed(2)}
                        </Text>
                    </Text>
                </Row>
            </Stack>
            <Row containerStyle={{ width: '100%' }}>
                <Row
                    containerStyle={{
                        width: '80%',
                        alignSelf: 'center',
                        overflow: 'hidden',
                        backgroundColor: theme.SECONDARY_BUTTON_COLOR,
                        borderRadius: SIZES.radius
                    }}
                    horizontalAlign="space-around"
                >
                    {[10, 15, 20, 25].map((p, index) => (
                        <TouchableOpacity
                            onPress={() => {
                                dispatch(
                                    setTipAmount({
                                        percentage: p,
                                        amount: (total * p) / 100
                                    })
                                );
                                dispatch(
                                    setGrandTotal(
                                        +(
                                            total +
                                            (total * p) / 100 +
                                            stripeFee(total, orderType)
                                        ).toFixed(2)
                                    )
                                );
                                setCustomTip('');
                            }}
                            style={{
                                justifyContent: 'center',
                                backgroundColor:
                                    percentage === p && !customTip
                                        ? theme.ASCENT
                                        : theme.SECONDARY_BUTTON_COLOR,
                                alignItems: 'center',
                                width: '25%',

                                paddingVertical: SIZES.padding * 0.5,

                                borderLeftColor: theme.TEXT_COLOR,
                                borderLeftWidth: index === 0 ? 0 : 0.5
                            }}
                            key={p}
                        >
                            <Text
                                lightText={percentage === p && !customTip}
                                bold={percentage === p && !customTip}
                                center
                            >
                                {p}%
                            </Text>
                        </TouchableOpacity>
                    ))}
                </Row>
                <TouchableOpacity
                    style={{ flexGrow: 1 }}
                    onPress={() => setShowCustomTip(true)}
                >
                    <Text px_4>Custom</Text>
                </TouchableOpacity>
            </Row>
        </View>
    );
};

export default CustomTip;
