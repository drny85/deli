import { Alert, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import Button from '../../../components/Button';
import { logoutUser } from '../../../redux/auth/authActions';

import Header from '../../../components/Header';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { SIZES } from '../../../constants';
import Row from '../../../components/Row';
import { useBusiness } from '../../../hooks/useBusiness';
import Loader from '../../../components/Loader';
import styled from '../../../styled-components';
import { updateBusiness } from '../../../redux/business/businessActions';
import InputField from '../../../components/InputField';
import { AnimatePresence, MotiView } from 'moti';
import ZipCodes from '../../../components/ZipCodes';

type Props = {};

const Settings = ({}: Props) => {
    const { user, loading } = useAppSelector((state) => state.auth);
    const theme = useAppSelector((state) => state.theme);
    const { business } = useBusiness(user?.id!);
    const dispatch = useAppDispatch();
    const [newMinimun, setNewMinimum] = useState<string>('');
    const [changingNewMinimum, setChangingNewMinimum] =
        useState<boolean>(false);
    const [newMinimumTitle, setNewMinimumTitle] = useState<
        'Change Minimum' | 'Cancel' | 'Update Minimum'
    >('Change Minimum');
    const [newETA, setNewETA] = useState<string>('');
    const [changingETA, setChangingETA] = useState<boolean>(false);
    const [etaTitle, setEtaTitle] = useState<
        'Change ETA' | 'Cancel' | 'Update ETA'
    >('Change ETA');
    const handleETAPress = () => {
        try {
            if (!changingETA) {
                setChangingETA(true);
            }
            if (etaTitle === 'Cancel') {
                setChangingETA(false);
            }
            if (changingETA && etaTitle === 'Update ETA' && newETA) {
                dispatch(
                    updateBusiness({
                        ...business!,
                        eta: +newETA
                    })
                );
                setNewETA('');
                setChangingETA(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleNewMinimunPress = () => {
        try {
            if (!changingNewMinimum) {
                setChangingNewMinimum(true);
            }
            if (newMinimumTitle === 'Cancel') {
                setChangingNewMinimum(false);
            }
            if (
                changingNewMinimum &&
                newMinimumTitle === 'Update Minimum' &&
                newMinimun
            ) {
                dispatch(
                    updateBusiness({
                        ...business!,
                        minimumDelivery: +newMinimun
                    })
                );
                setNewMinimum('');
                setChangingNewMinimum(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleOpenCloseStore = () => {
        try {
            if (!business) return;
            Alert.alert(
                `${business.isOpen ? 'Closing Store' : 'Opening Store'}`,
                'Are you sure you want to perform this operation?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Yes, I am Sure',
                        style: 'destructive',
                        onPress: () => {
                            dispatch(
                                updateBusiness({
                                    ...business,
                                    isOpen: !business?.isOpen
                                })
                            );
                        }
                    }
                ]
            );
        } catch (error) {
            console.log(error);
        }
    };

    const confirmLogout = () => {
        Alert.alert('Logging Out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Yes, Exit',
                onPress: () => dispatch(logoutUser()),
                style: 'destructive'
            }
        ]);
    };

    useEffect(() => {
        if (changingETA && !newETA) {
            setEtaTitle('Cancel');
        } else if (changingETA && newETA) {
            setEtaTitle('Update ETA');
        } else if (!newETA || !changingETA) {
            setEtaTitle('Change ETA');
        }
    }, [newETA, changingETA]);
    useEffect(() => {
        if (changingNewMinimum && !newMinimun) {
            setNewMinimumTitle('Cancel');
        } else if (changingNewMinimum && newMinimun) {
            setNewMinimumTitle('Update Minimum');
        } else if (!newMinimun || !changingNewMinimum) {
            setNewMinimumTitle('Change Minimum');
        }
    }, [newMinimun, changingNewMinimum]);
    if (loading) return <Loader />;
    return (
        <Screen>
            <Header
                title={`Hi ${user?.name}`}
                rightIcon={
                    <TouchableOpacity
                        onPress={confirmLogout}
                        style={{ paddingRight: SIZES.padding }}
                    >
                        <FontAwesome
                            name="sign-out"
                            size={26}
                            color={theme.TEXT_COLOR}
                        />
                    </TouchableOpacity>
                }
            />
            <View style={{ flex: 1 }}>
                <ListItem style={{ elevation: 6 }}>
                    <Row horizontalAlign="space-between">
                        <Text bold>Store Status</Text>
                        <Row>
                            <Text px_4>
                                {business?.isOpen ? 'Open' : 'Closed'}
                            </Text>
                            <View
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    backgroundColor: business?.isOpen
                                        ? 'green'
                                        : theme.DANGER
                                }}
                            />
                        </Row>
                        <View>
                            <Button
                                outlined
                                containerStyle={{ borderRadius: 10 }}
                                title={
                                    business?.isOpen
                                        ? 'Close Store'
                                        : 'Open Store'
                                }
                                onPress={handleOpenCloseStore}
                            />
                        </View>
                    </Row>
                </ListItem>
                <ListItem style={{ elevation: 6 }}>
                    <Row horizontalAlign="space-between">
                        <Text bold>Minumim Delivery Amount</Text>
                        <Row>
                            <Text bold>{business?.minimumDelivery} Mins</Text>
                        </Row>
                        <View>
                            <Button
                                outlined
                                containerStyle={{ borderRadius: 10 }}
                                title={newMinimumTitle}
                                onPress={handleNewMinimunPress}
                            />
                        </View>
                    </Row>
                    <AnimatePresence>
                        {changingNewMinimum && (
                            <MotiView
                                from={{ opacity: 0, translateY: -10 }}
                                animate={{
                                    opacity: 1,
                                    translateY: 0,
                                    height: 80
                                }}
                                transition={{ type: 'timing' }}
                                exit={{
                                    opacity: 0,
                                    translateY: -10,
                                    height: 0
                                }}
                            >
                                <View
                                    style={{
                                        alignSelf: 'center',
                                        width: '25%'
                                    }}
                                >
                                    <InputField
                                        p_y={8}
                                        placeholder="How many minutes"
                                        value={newMinimun}
                                        contentStyle={{ textAlign: 'center' }}
                                        onChangeText={setNewMinimum}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </MotiView>
                        )}
                    </AnimatePresence>
                </ListItem>

                <ListItem style={{ elevation: 6 }}>
                    <Row horizontalAlign="space-between">
                        <Text bold>Estimated Delivery Arrival</Text>
                        <Row>
                            <Text bold>
                                {business?.eta ? business.eta : 20} Mins
                            </Text>
                        </Row>
                        <View>
                            <Button
                                outlined
                                containerStyle={{ borderRadius: 10 }}
                                title={etaTitle}
                                onPress={handleETAPress}
                            />
                        </View>
                    </Row>
                    <AnimatePresence>
                        {changingETA && (
                            <MotiView
                                from={{ opacity: 0, translateY: -10 }}
                                animate={{
                                    opacity: 1,
                                    translateY: 0,
                                    height: 80
                                }}
                                transition={{ type: 'timing' }}
                                exit={{
                                    opacity: 0,
                                    translateY: -10,
                                    height: 0
                                }}
                            >
                                <View
                                    style={{
                                        alignSelf: 'center',
                                        width: '25%'
                                    }}
                                >
                                    <InputField
                                        p_y={8}
                                        placeholder="How many minutes"
                                        value={newETA}
                                        contentStyle={{ textAlign: 'center' }}
                                        onChangeText={setNewETA}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </MotiView>
                        )}
                    </AnimatePresence>
                </ListItem>
                <ListItem style={{ elevation: 6 }}>
                    <Row horizontalAlign="space-between">
                        <Text bold>Delivery Miles Radius</Text>
                        <Row>
                            <Text bold>
                                {business?.milesRadius
                                    ? business.milesRadius
                                    : 6}{' '}
                                Miles
                            </Text>
                        </Row>
                        <View>
                            <Button
                                outlined
                                containerStyle={{ borderRadius: 10 }}
                                title={etaTitle}
                                onPress={handleETAPress}
                            />
                        </View>
                    </Row>
                    <AnimatePresence>
                        {changingETA && (
                            <MotiView
                                from={{ opacity: 0, translateY: -10 }}
                                animate={{
                                    opacity: 1,
                                    translateY: 0,
                                    height: 80
                                }}
                                transition={{ type: 'timing' }}
                                exit={{
                                    opacity: 0,
                                    translateY: -10,
                                    height: 0
                                }}
                            >
                                <View
                                    style={{
                                        alignSelf: 'center',
                                        width: '25%'
                                    }}
                                >
                                    <InputField
                                        p_y={8}
                                        placeholder="How many minutes"
                                        value={newETA}
                                        contentStyle={{ textAlign: 'center' }}
                                        onChangeText={setNewETA}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </MotiView>
                        )}
                    </AnimatePresence>
                </ListItem>
                <ListItem>
                    <ZipCodes zips={business?.zips || []} />
                </ListItem>
            </View>
        </Screen>
    );
};

export default Settings;
const ListItem = styled.View`
    background-color: ${({ theme }) => theme.BACKGROUND_COLOR};
    padding: 12px;
    box-shadow: 8px 6px 8px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    margin: 10px 0px;
`;
