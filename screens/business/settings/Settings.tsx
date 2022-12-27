import { View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useAppSelector } from '../../../redux/store';
import Button from '../../../components/Button';

type Props = {};

const Settings = ({}: Props) => {
    const { user } = useAppSelector((state) => state.auth);
    return (
        <Screen center>
            <Text>Settings Business</Text>
            <Text py_8>Hi, {user?.name}</Text>
            <Button onPress={() => {}} title="Sign Out" />
        </Screen>
    );
};

export default Settings;
