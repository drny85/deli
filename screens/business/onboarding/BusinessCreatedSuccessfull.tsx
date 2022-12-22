import { View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import Button from '../../../components/Button';
import { getBusiness } from '../../../redux/business/businessActions';

type Props = {};

const BusinessCreatedSuccessfull = ({}: Props) => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    return (
        <Screen center>
            <Text py_8 lobster large animation={'fadeInDown'}>
                Congratulations
            </Text>
            <Text medium py_4 animation={'fadeInLeft'} delay={600}>
                Your business is almost ready to go
            </Text>
            <Text animation={'fadeInRight'} delay={800}>
                You already took care of one of the most important steps. How to
                get paid!
            </Text>
            <View
                style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    bottom: 60
                }}
            >
                <Button
                    title="Go to my Store"
                    onPress={() => {
                        dispatch(getBusiness(user?.id!));
                    }}
                />
            </View>
        </Screen>
    );
};

export default BusinessCreatedSuccessfull;
