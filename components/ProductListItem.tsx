import { View } from 'react-native';
import React from 'react';

import Text from './Text';

import { CartItem } from '../redux/consumer/cartSlide';
import Row from './Row';
import { SIZES } from '../constants';
import Divider from './Divider';

type Props = {
    item: CartItem;
    index: number;
    themeTextColor?: boolean;
};

const ProductListItem = ({ item, index, themeTextColor }: Props) => {
    return (
        <View>
            <Row
                containerStyle={{
                    width: '100%',
                    marginVertical: SIZES.base
                }}
                horizontalAlign="space-between"
                key={index.toString()}
            >
                <View>
                    <Text darkText={themeTextColor} left>
                        {item.quantity} - {item.name}
                    </Text>
                </View>
                <Row
                    containerStyle={{
                        width: '60%'
                    }}
                    horizontalAlign="space-between"
                >
                    <Text darkText={themeTextColor} capitalize px_6>
                        {item.size ? item.size.size.substring(0, 1) : ''}
                    </Text>
                    <Text darkText={themeTextColor} center>
                        {item.size ? item.size.price : item.price}
                    </Text>
                    <Text darkText={themeTextColor} bold>
                        $
                        {(
                            (item.size ? item.size.price : +item.price) *
                            item.quantity
                        ).toFixed(2)}
                    </Text>
                </Row>
            </Row>
            {item.instructions && (
                <Text darkText={themeTextColor} small px_6>
                    -- {item.instructions}
                </Text>
            )}
            <Divider />
        </View>
    );
};

export default ProductListItem;
