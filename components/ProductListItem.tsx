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
};

const ProductListItem = ({ item, index }: Props) => {
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
                    <Text left>
                        {item.quantity} - {item.name}
                    </Text>
                </View>
                <Row
                    containerStyle={{
                        width: '60%'
                    }}
                    horizontalAlign="space-between"
                >
                    <Text capitalize px_6>
                        {item.size ? item.size.size.substring(0, 1) : ''}
                    </Text>
                    <Text center>
                        {item.size ? item.size.price : item.price}
                    </Text>
                    <Text bold>
                        $
                        {(
                            (item.size ? item.size.price : +item.price) *
                            item.quantity
                        ).toFixed(2)}
                    </Text>
                </Row>
            </Row>
            {item.instructions && (
                <Text small px_6>
                    -- {item.instructions}
                </Text>
            )}
            <Divider />
        </View>
    );
};

export default ProductListItem;
