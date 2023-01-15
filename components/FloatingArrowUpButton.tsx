import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useAppSelector } from '../redux/store';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
    onPress: () => void;
    show: boolean;
};

const FloatingArrowUpButton = ({ show, onPress }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    return (
        <AnimatePresence>
            {!show && (
                <MotiView
                    style={{
                        position: 'absolute',
                        bottom: 30,
                        right: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    from={{
                        opacity: 0,
                        height: 0,
                        width: 0,
                        borderRadius: 0
                    }}
                    animate={{
                        opacity: 1,
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        backgroundColor: theme.ASCENT,
                        zIndex: 300
                    }}
                    transition={{ type: 'timing' }}
                    exit={{ opacity: 0, width: 0, height: 0 }}
                >
                    <TouchableOpacity
                        onPress={onPress}
                        style={{
                            padding: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <FontAwesome
                            name="arrow-up"
                            size={22}
                            color={theme.TEXT_COLOR}
                        />
                    </TouchableOpacity>
                </MotiView>
            )}
        </AnimatePresence>
    );
};

export default FloatingArrowUpButton;
