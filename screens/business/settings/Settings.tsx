import { View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import Button from '../../../components/Button';
import { logoutUser } from '../../../redux/auth/authActions';

type Props = {};

const Settings = ({}: Props) => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    return (
        <Screen center>
            <Text>Settings Business</Text>
            <Text py_8>Hi, {user?.name}</Text>
            <Text py_8>Hi, {user?.email}</Text>
            <Button
                onPress={() => {
                    dispatch(logoutUser());
                }}
                title="Sign Out"
            />
        </Screen>
    );
};

export default Settings;
