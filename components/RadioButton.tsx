import { TouchableOpacity, View } from 'react-native';
import React from 'react';

import Text from './Text';
import { MotiView } from 'moti';
import { useAppSelector } from '../redux/store';

type Props = {
   selected: boolean;
   onPress: () => void;
};

const HEIGHT = 24;

const RadioButton = ({ selected, onPress }: Props) => {
   const theme = useAppSelector((state) => state.theme);
   return (
      <TouchableOpacity onPress={onPress}>
         <MotiView
            style={{
               height: HEIGHT,

               width: HEIGHT,
               borderRadius: HEIGHT / 2,

               borderColor: theme.ASCENT,
               borderWidth: 0.4,
               justifyContent: 'center',
               alignItems: 'center'
            }}
         >
            <MotiView
               style={{
                  height: HEIGHT * 0.7,
                  width: HEIGHT * 0.7,
                  borderRadius: (HEIGHT * 0.7) / 2,
                  borderColor: theme.ASCENT,
                  borderWidth: 0.4
               }}
               animate={{
                  backgroundColor: selected
                     ? theme.ASCENT
                     : theme.BACKGROUND_COLOR
               }}
               transition={{ type: 'timing' }}
               exit={{ backgroundColor: theme.BACKGROUND_COLOR }}
            />
         </MotiView>
      </TouchableOpacity>
   );
};

export default RadioButton;
