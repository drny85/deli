import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import React from 'react';

import Text from './Text';
import { AnimatePresence, MotiView } from 'moti';
import Row from './Row';
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '../redux/store';
import Button from './Button';

type Props = {
    show: boolean;
    variationQuantity: number;
    onPressVariation: (value: 'minus' | 'plus') => void;
    onPressDone: () => void;
    containerStyle?: StyleProp<ViewStyle>;
};

const VariantionSelector = ({
    show,
    onPressVariation,
    variationQuantity,
    onPressDone,
    containerStyle
}: Props) => {
    const theme = useAppSelector((state) => state.theme);
    return (
        <AnimatePresence>
            {show && (
                <MotiView
                    from={{
                        opacity: 0,
                        translateY: -20
                    }}
                    animate={{
                        opacity: 1,
                        translateY: 0
                    }}
                    style={[{ marginBottom: 20 }, containerStyle]}
                >
                    <Row>
                        <Text bold px_4>
                            How many variantion?
                        </Text>
                        <Row
                            containerStyle={{
                                width: 150
                            }}
                            horizontalAlign="space-evenly"
                        >
                            <TouchableOpacity
                                onPress={() => onPressVariation('minus')}
                            >
                                <FontAwesome
                                    name="minus-circle"
                                    size={34}
                                    color={theme.TEXT_COLOR}
                                />
                            </TouchableOpacity>
                            <Text bold medium>
                                {variationQuantity}
                            </Text>
                            <TouchableOpacity
                                style={{
                                    opacity: variationQuantity === 6 ? 0.5 : 1
                                }}
                                disabled={variationQuantity === 6}
                                onPress={() => onPressVariation('plus')}
                            >
                                <FontAwesome
                                    name="plus-circle"
                                    size={34}
                                    color={theme.TEXT_COLOR}
                                />
                            </TouchableOpacity>
                        </Row>
                        <Button title={`Done`} onPress={onPressDone} />
                    </Row>
                </MotiView>
            )}
        </AnimatePresence>
    );
};

export default VariantionSelector;
