import { Image, View } from 'react-native';
import React from 'react';

import Text from '../../components/Text';
import { Courier } from '../../types';
import Stack from '../Stack';
import Row from '../Row';
import { IMAGE_PLACEHOLDER } from '../../constants';

type Props = {
    courier: Courier;
};

const CourierCard = ({ courier }: Props) => {
    return (
        <Stack>
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
                        {courier.name}
                    </Text>
                </Stack>
                <Stack>
                    <Text lobster large>
                        rating 4.9
                    </Text>
                </Stack>
            </Row>
        </Stack>
    );
};

export default CourierCard;
