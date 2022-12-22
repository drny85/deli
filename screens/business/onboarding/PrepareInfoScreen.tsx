import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useAppSelector } from '../../../redux/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessOnBoardingStackScreens } from '../../../navigation/business/typing';
import Header from '../../../components/Header';
import { SIZES } from '../../../constants';
import Divider from '../../../components/Divider';
import { INFO } from '../../../utils/onboardingList';
import { FontAwesome } from '@expo/vector-icons';

type Props = NativeStackScreenProps<
    BusinessOnBoardingStackScreens,
    'PrepareInfoScreen'
>;

const PrepareInfoScreen = ({ navigation }: Props) => {
    const { business } = useAppSelector((state) => state.business);
    const theme = useAppSelector((state) => state.theme);
    return (
        <Screen>
            <Header
                onPressBack={() => navigation.goBack()}
                title="Information Needed"
            />
            <View style={styles.container}>
                <Text medium animation={'fadeInDown'}>
                    We need more information to get {business?.name} ready for
                    business
                </Text>
                <Divider />
                <Text bold py_4>
                    Please get ready the following information for the next
                    screen.
                </Text>
                <View>
                    {INFO.map((info, index) => (
                        <Text
                            animation={'fadeInLeft'}
                            py_4
                            delay={index * 600}
                            key={index.toString()}
                        >
                            {index + 1} - {info}
                        </Text>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('BusinessInformation');
                }}
                style={{
                    position: 'absolute',
                    flexDirection: 'row',
                    bottom: 40,
                    right: 30,
                    padding: 20,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Text px_4 bold>
                    Next
                </Text>
                <FontAwesome
                    name="chevron-right"
                    size={20}
                    color={theme.TEXT_COLOR}
                />
            </TouchableOpacity>
        </Screen>
    );
};

export default PrepareInfoScreen;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SIZES.base,
        paddingVertical: SIZES.padding,
        alignItems: 'center'
    }
});
