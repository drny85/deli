import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import React from 'react';

import Text from '../Text';
import Screen from '../Screen';
import { BusinessDay } from '../../types';
import Row from '../Row';
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '../../redux/store';
import { SIZES } from '../../constants';
import Button from '../Button';

type Props = {
    visisble: boolean;
    onPress: () => void;
    data: BusinessDay;
    onGoBack: () => void;
};

const BusinessHoursReviewModal = ({
    visisble,
    onPress,
    data,
    onGoBack
}: Props): JSX.Element => {
    const theme = useAppSelector((state) => state.theme);

    return (
        <Modal visible={visisble} animationType="slide">
            <Screen>
                <Row
                    containerStyle={{
                        maxWidth: 600,
                        alignSelf: 'center',
                        width: '100%',
                        paddingHorizontal: SIZES.base
                    }}
                    horizontalAlign="space-between"
                >
                    <Text py_4 capitalize center lobster large>
                        Please review this hours
                    </Text>
                    <TouchableOpacity onPress={onGoBack}>
                        <FontAwesome
                            name="edit"
                            size={26}
                            color={theme.TEXT_COLOR}
                        />
                    </TouchableOpacity>
                </Row>
                <ScrollView
                    contentContainerStyle={{
                        maxWidth: 700,
                        width: '100%',
                        alignSelf: 'center',
                        marginTop: 30,
                        paddingHorizontal: SIZES.base
                    }}
                >
                    {Object.entries(data).map(([key, value]) => {
                        const d = key.toLowerCase();

                        return (
                            <Row
                                horizontalAlign="space-between"
                                key={key}
                                containerStyle={{
                                    marginVertical: SIZES.padding,
                                    paddingHorizontal: SIZES.base
                                }}
                            >
                                <Text capitalize>{key}</Text>
                                <Row
                                    containerStyle={{ width: '60%' }}
                                    horizontalAlign="space-evenly"
                                >
                                    <Text>{data[d].openAt}</Text>
                                    <Text>{data[d].closeAt}</Text>
                                </Row>
                            </Row>
                        );
                    })}
                    <View
                        style={{
                            width: '80%',
                            maxHeight: 400,
                            alignSelf: 'center',
                            marginVertical: SIZES.padding
                        }}
                    >
                        <Button title="Looks God!" onPress={onPress} />
                    </View>
                </ScrollView>
            </Screen>
        </Modal>
    );
};

export default BusinessHoursReviewModal;
