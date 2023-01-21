import {
    Alert,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import React, { useState } from 'react';

import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { MotiText, MotiView } from 'moti';
import { logoutUser } from '../../redux/auth/authActions';

const WIDTH = 50;
type Props = {
    navigation: any;
};
const MenuButtons = ({ navigation }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const [show, setShow] = useState(false);
    const dispatch = useAppDispatch();
    const toogle = () => {
        setShow((prev) => !prev);
    };

    const handleLogOut = async () => {
        try {
            Alert.alert('Logging Out', 'Are you sure you want to log out?', [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: () => dispatch(logoutUser())
                }
            ]);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <View style={[styles.container, { shadowColor: theme.SHADOW_COLOR }]}>
            <TouchableOpacity onPress={handleLogOut}>
                <MotiView
                    style={[
                        styles.btn,
                        styles.secondary,

                        { backgroundColor: theme.BACKGROUND_COLOR }
                    ]}
                    from={{ translateY: 0 }}
                    animate={{ translateY: show ? -WIDTH * 3.3 : 0 }}
                    transition={{ type: 'timing' }}
                >
                    <MotiText
                        style={{
                            position: 'absolute',
                            fontWeight: '700',
                            fontFamily: 'lobster',
                            fontSize: 22,
                            color: theme.TEXT_COLOR
                        }}
                        from={{ translateX: 0, opacity: 0 }}
                        animate={{
                            translateX: show ? -68 : 0,
                            opacity: show ? 1 : 0
                        }}
                        transition={{ type: 'timing' }}
                    >
                        Log Out
                    </MotiText>
                    <Entypo name="log-out" size={26} color={theme.TEXT_COLOR} />
                </MotiView>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('CourierDeliveries')}
            >
                <MotiView
                    style={[
                        styles.btn,
                        styles.secondary,

                        { backgroundColor: theme.BACKGROUND_COLOR }
                    ]}
                    from={{ translateY: 0 }}
                    animate={{ translateY: show ? -WIDTH * 2.2 : 0 }}
                    transition={{ type: 'timing' }}
                >
                    <MotiText
                        style={{
                            position: 'absolute',
                            fontWeight: '700',
                            fontFamily: 'lobster',
                            fontSize: 22,
                            color: theme.TEXT_COLOR
                        }}
                        from={{ translateX: 0, opacity: 0 }}
                        animate={{
                            translateX: show ? -85 : 0,
                            opacity: show ? 1 : 0
                        }}
                        transition={{ type: 'timing' }}
                    >
                        In Progress
                    </MotiText>
                    <FontAwesome
                        name="clock-o"
                        size={26}
                        color={theme.TEXT_COLOR}
                    />
                </MotiView>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('MyDeliveries')}
            >
                <MotiView
                    style={[
                        styles.btn,
                        styles.secondary,

                        {
                            backgroundColor: theme.BACKGROUND_COLOR,
                            shadowColor: theme.SHADOW_COLOR
                        }
                    ]}
                    from={{ translateY: 0 }}
                    animate={{ translateY: show ? -WIDTH : 0 }}
                    transition={{ type: 'timing' }}
                >
                    <MotiText
                        style={{
                            position: 'absolute',
                            fontWeight: '700',
                            fontFamily: 'lobster',
                            fontSize: 22,
                            color: theme.TEXT_COLOR
                        }}
                        from={{ translateX: 0, opacity: 0 }}
                        animate={{
                            translateX: show ? -80 : 0,
                            opacity: show ? 1 : 0
                        }}
                        transition={{ type: 'timing' }}
                    >
                        Deliveries
                    </MotiText>
                    <FontAwesome
                        name="bicycle"
                        size={26}
                        color={theme.TEXT_COLOR}
                    />
                </MotiView>
            </TouchableOpacity>
            <TouchableOpacity onPress={toogle}>
                <MotiView
                    style={[
                        styles.btn,

                        {
                            backgroundColor: theme.BACKGROUND_COLOR,
                            shadowColor: theme.SHADOW_COLOR
                        }
                    ]}
                    from={{ rotateZ: '0deg' }}
                    animate={{ rotateZ: show ? '45ged' : '0deg' }}
                    transition={{ type: 'spring', damping: 10 }}
                >
                    <AntDesign
                        name="menu-unfold"
                        size={26}
                        color={theme.TEXT_COLOR}
                    />
                </MotiView>
            </TouchableOpacity>
        </View>
    );
};

export default MenuButtons;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 110,
        right: 90,
        elevation: 10
    },
    btn: {
        position: 'absolute',
        width: WIDTH,
        height: WIDTH,
        borderRadius: WIDTH / 2,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { height: 6, width: 3 },
        elevation: 6,
        flexDirection: 'row',
        zIndex: 300
    },

    secondary: {
        width: WIDTH * 0.85,
        height: WIDTH * 0.85,
        borderRadius: (WIDTH * 0.85) / 2
    }
});
