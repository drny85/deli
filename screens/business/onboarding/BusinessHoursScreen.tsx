import { Alert, View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import KeyboardScreen from '../../../components/KeyboardScreen';
import { BusinessDay, ConnectedAccountParams, DAYS } from '../../../types';
import Row from '../../../components/Row';
import InputField from '../../../components/InputField';
import { SIZES } from '../../../constants';
import { formatHour } from '../../../utils/formatPhone';
import Button from '../../../components/Button';
import { Business } from '../../../redux/business/businessSlide';
import { updateBusiness } from '../../../redux/business/businessActions';
import Loader from '../../../components/Loader';
import BusinessHoursReviewModal from '../../../components/BusinessHoursReviewModal';
import { connectedStore } from '../../../firebase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessOnBoardingStackScreens } from '../../../navigation/business/typing';
import OnBoardingStripeLottiView from '../../../components/OnBoardingStripeLottiView';
import Divider from '../../../components/Divider';

type Props = NativeStackScreenProps<
    BusinessOnBoardingStackScreens,
    'BusinessHoursScreen'
>;

const BusinessHoursScreen = ({ navigation }: Props) => {
    const { business } = useAppSelector((state) => state.business);
    const [showReview, setShowReview] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const dispatch = useAppDispatch();
    const [businessHours, setBusinessHours] = React.useState<BusinessDay>({
        sunday: { openAt: '09:00', closeAt: '10:00' },
        monday: { openAt: '07:00', closeAt: '11:00' },
        tuesday: { openAt: '07:00', closeAt: '11:00' },
        wednesday: { openAt: '07:00', closeAt: '11:00' },
        thursday: { openAt: '07:00', closeAt: '11:00' },
        friday: { openAt: '07:00', closeAt: '11:00' },
        saturday: { openAt: '08:00', closeAt: '12:00' }
    });

    const handleReviewBusinessHours = () => {
        const valid = Object.values(businessHours).every(
            (v) => v.openAt.length === 5 && v.closeAt.length === 5
        );

        if (!valid) {
            Alert.alert(
                'Invalid business hours',
                'Please enter valid business hours, must have two digist for the hour and two digits for the minutes. Ex 10:30, 08:00'
            );
            return;
        }
        setShowReview(true);
    };

    const handleUpdateBusinessDay = React.useCallback(async () => {
        const businessData: Business = {
            ...business!,
            hours: businessHours
        };
        try {
            const { payload } = await dispatch(updateBusiness(businessData));
            if (!payload) return;
            setShowReview(false);
            await getConnectedStoreUrl();
        } catch (error) {
            console.log(error);
        }
    }, []);

    const getConnectedStoreUrl = async () => {
        try {
            if (!business) return;
            const func = connectedStore('createConnectedBusinessAccount');
            setLoading(true);
            const params: ConnectedAccountParams = {
                businessName: business?.name,
                phone: business.phone!,
                address: business.address!,
                lastName: business.owner.lastName,
                name: business.owner.name
            };
            const { data } = await func({
                ...params
            });
            if (data.success) {
                console.log(data.result);
                console.log('Still in business hours');
                navigation.navigate('BusinessStripeAccountCreation', {
                    url: data.result,
                    data: { ...params }
                });
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    if (!business) return <Loader />;
    if (loading) return <OnBoardingStripeLottiView />;

    return (
        <Screen>
            <Text center large py_4 lobster>
                {business?.name} Hours
            </Text>
            <Text center px_4 raleway>
                Please verify each day and make chages accordingly
            </Text>
            <Divider />
            <KeyboardScreen>
                <View
                    style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        maxWidth: 600,
                        alignSelf: 'center'
                    }}
                >
                    <View style={{ width: '100%' }}>
                        {DAYS.map((day) => {
                            const d = day.toLowerCase();
                            return (
                                <Row
                                    horizontalAlign="space-between"
                                    containerStyle={{
                                        width: '100%',

                                        maxWidth: 600
                                    }}
                                    key={day}
                                >
                                    <View style={{ width: '25%' }}>
                                        <Text bold>{day}</Text>
                                    </View>
                                    <Row
                                        horizontalAlign="center"
                                        containerStyle={{
                                            width: '70%'
                                        }}
                                    >
                                        <InputField
                                            label="open at"
                                            smallLabel
                                            centerLabel
                                            nogap
                                            mainStyle={{
                                                width: '40%'
                                            }}
                                            p_y={8}
                                            placeholder={'Ex. 08:00'}
                                            maxLenght={5}
                                            value={businessHours[d].openAt}
                                            rightIcon={
                                                <Text small bold>
                                                    AM
                                                </Text>
                                            }
                                            onChangeText={(text) =>
                                                setBusinessHours({
                                                    ...businessHours,
                                                    [d]: {
                                                        openAt: formatHour(
                                                            text
                                                        ),
                                                        closeAt:
                                                            businessHours[d]
                                                                .closeAt
                                                    }
                                                })
                                            }
                                        />
                                        <View
                                            style={{ width: SIZES.padding }}
                                        />
                                        <InputField
                                            label="close at"
                                            smallLabel
                                            centerLabel
                                            maxLenght={5}
                                            nogap
                                            p_y={8}
                                            mainStyle={{ width: '40%' }}
                                            placeholder={'Ex. 10:00'}
                                            value={businessHours[d].closeAt}
                                            rightIcon={
                                                <Text small bold>
                                                    PM
                                                </Text>
                                            }
                                            onChangeText={(text) =>
                                                setBusinessHours({
                                                    ...businessHours,
                                                    [d]: {
                                                        openAt: businessHours[d]
                                                            .openAt,
                                                        closeAt:
                                                            formatHour(text)
                                                    }
                                                })
                                            }
                                        />
                                    </Row>
                                </Row>
                            );
                        })}
                    </View>
                    <View
                        style={{
                            marginTop: 30,
                            width: '80%',
                            alignSelf: 'center'
                        }}
                    >
                        <Button
                            title="Review Hours"
                            onPress={handleReviewBusinessHours}
                        />
                    </View>
                </View>
            </KeyboardScreen>
            <BusinessHoursReviewModal
                onGoBack={() => setShowReview(false)}
                visisble={showReview}
                data={businessHours}
                onPress={handleUpdateBusinessDay}
            />
        </Screen>
    );
};

export default BusinessHoursScreen;
