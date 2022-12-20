import { ViewStyle, SafeAreaView } from 'react-native';
import React from 'react';
import { MotiView } from 'moti';
import { useAppSelector } from '../redux/store';
import { SIZES } from '../constants';

interface Props {
    children: React.ReactNode;
    containerStyle?: ViewStyle;
    center?: boolean;
}
const Screen = ({ children, center, containerStyle }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    return (
        <MotiView
            animate={{ backgroundColor: theme.BACKGROUND_COLOR }}
            transition={{ type: 'timing', duration: 300 }}
            style={[
                {
                    flex: 1,
                    justifyContent: center ? 'center' : undefined,
                    alignItems: center ? 'center' : undefined,
                    paddingTop: SIZES.statusBarHeight,
                    padding: SIZES.base
                },
                containerStyle
            ]}
        >
            {children}
        </MotiView>
    );
};

export default Screen;
