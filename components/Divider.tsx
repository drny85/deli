import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useAppSelector } from '../redux/store';

interface Props {
    bgColor?: ViewStyle['backgroundColor'];
    small?: boolean;
    thickness?: 'small' | 'medium' | 'large';
    py?: number;
}

const Divider = ({ bgColor, small, thickness, py }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    return (
        <View
            style={[
                styles.view,
                {
                    backgroundColor: bgColor ? bgColor : theme.ASCENT,
                    width: small ? '75%' : '95%',
                    alignSelf: 'center',
                    marginVertical: py ? py : 10,
                    height:
                        thickness === 'small'
                            ? 0.4
                            : thickness === 'medium'
                            ? 1.5
                            : thickness === 'large'
                            ? 2.5
                            : 0.4
                }
            ]}
        ></View>
    );
};

export default Divider;

const styles = StyleSheet.create({
    view: {
        width: '95%',
        height: 0.4,
        justifyContent: 'center',
        alignSelf: 'center',
        opacity: 0.4,
        elevation: 10,
        margin: 10
    }
});
