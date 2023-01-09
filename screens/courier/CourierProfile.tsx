import { View } from 'react-native';
import React from 'react';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import Button from '../../components/Button';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/auth/authActions';

type Props = {};

const CourierProfile = ({}: Props) => {
    const dispatch = useDispatch();

    const handleLogout = async () => {
        //@ts-ignore
        dispatch(logoutUser());
    };
    return (
        <Screen center>
            <Text>CourierProfile </Text>

            <Button title="Log Out" onPress={handleLogout} />
        </Screen>
    );
};

export default CourierProfile;
