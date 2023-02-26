import { TouchableOpacity } from 'react-native';
import React from 'react';

import Text from './Text';
import { MotiView } from 'moti';
import { useAppSelector } from '../redux/store';
import { STATUS_NAME } from '../utils/orderStatus';
import { ORDER_STATUS } from '../redux/consumer/ordersSlide';
import Row from './Row';

type Props = {
    selected: boolean;
    onPress: () => void;
    status: ORDER_STATUS;
};

const HEIGHT = 24;

const RadioButton = ({ selected, onPress, status }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    return (
        <TouchableOpacity style={{ marginVertical: 10 }} onPress={onPress}>
            <Row>
                <MotiView
                    style={{
                        height: HEIGHT,

                        width: HEIGHT,
                        borderRadius: HEIGHT / 2,

                        borderColor:
                            theme.mode === 'light'
                                ? theme.ASCENT
                                : theme.WHITE_COLOR,
                        borderWidth: 0.4,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <MotiView
                        style={{
                            height: HEIGHT * 0.7,
                            width: HEIGHT * 0.7,
                            borderRadius: (HEIGHT * 0.7) / 2,
                            borderColor:
                                theme.mode === 'light'
                                    ? theme.ASCENT
                                    : theme.WHITE_COLOR,
                            borderWidth: 0.4
                        }}
                        animate={{
                            backgroundColor: selected
                                ? theme.ASCENT
                                : theme.BACKGROUND_COLOR
                        }}
                        transition={{ type: 'timing' }}
                        exit={{ backgroundColor: theme.BACKGROUND_COLOR }}
                    />
                </MotiView>
                <Text bold={selected} px_4>
                    {STATUS_NAME(status)}
                </Text>
            </Row>
        </TouchableOpacity>
    );
};

export default RadioButton;
