import { View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import Button from '../../../components/Button';
import { logoutUser } from '../../../redux/auth/authActions';
import { switchTheme } from '../../../redux/themeSlide';
import { darkTheme, lightTheme } from '../../../Theme';

type Props = {};

const Settings = ({}: Props) => {
    const { user } = useAppSelector((state) => state.auth);
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();
    return (
        <Screen>
            <Button
                title="Switch Theme"
                onPress={() => {
                    console.log('S', theme.mode);
                    if (theme.mode === 'dark') {
                        dispatch(switchTheme(lightTheme));
                    } else {
                        console.log('HERE');
                        dispatch(switchTheme(darkTheme));
                    }
                }}
            />
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
