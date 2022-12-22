import { View, StyleSheet } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import Header from '../../../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessOnBoardingStackScreens } from '../../../navigation/business/typing';
import { SIZES } from '../../../constants';
import { useAppSelector } from '../../../redux/store';

type Props = NativeStackScreenProps<
    BusinessOnBoardingStackScreens,
    'BusinessInformation'
>;

const BusinessInformation = ({ navigation }: Props) => {
    const { business } = useAppSelector((state) => state.business);
    return (
        <Screen>
            <Header
                onPressBack={() => navigation.goBack()}
                title="Business' Info"
            />
            <View style={styles.container}>
                <Text animation={'fadeInDown'}>
                    We need more information to get {business?.name} ready for
                    business
                </Text>
            </View>
        </Screen>
    );
};

export default BusinessInformation;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SIZES.base,
        paddingVertical: SIZES.padding,
        alignItems: 'center'
    }
});
