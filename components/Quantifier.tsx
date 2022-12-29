import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import React from 'react';

import Text from './Text';
import { MotiView } from 'moti';
import Row from './Row';
import { SIZES } from '../constants';
import { useAppSelector } from '../redux/store';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
   quantity: number;
   onPressLeft: () => void;
   onPressRight: () => void;
   containerStyle?: StyleProp<ViewStyle>;
};

const Quantifier = ({
   quantity,
   onPressLeft,
   onPressRight,
   containerStyle
}: Props) => {
   const theme = useAppSelector((state) => state.theme);
   return (
      <MotiView
         from={{ opacity: 0, scale: 0 }}
         animate={{ opacity: 1, scale: 1 }}
         style={[
            {
               width: SIZES.width * 0.3,
               borderWidth: 0.5,
               borderColor: theme.SHADOW_COLOR,
               justifyContent: 'space-evenly',
               alignItems: 'center',
               height: 50,
               borderRadius: SIZES.radius * 3,
               backgroundColor: theme.BACKGROUND_COLOR,
               flexDirection: 'row',
               alignSelf: 'center'
            },
            containerStyle
         ]}
      >
         <TouchableOpacity style={{ padding: 6 }} onPress={onPressLeft}>
            <FontAwesome name="minus" size={20} color={theme.TEXT_COLOR} />
         </TouchableOpacity>
         <Text bold medium>
            {quantity}
         </Text>
         <TouchableOpacity style={{ padding: 6 }} onPress={onPressRight}>
            <FontAwesome name="plus" size={20} color={theme.TEXT_COLOR} />
         </TouchableOpacity>
      </MotiView>
   );
};

export default Quantifier;
