import {
   ImageBackground,
   ScrollView,
   StyleSheet,
   TouchableOpacity,
   View
} from 'react-native';
import React from 'react';

import Text from '../../../components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConsumerHomeStackScreens } from '../../../navigation/consumer/typing';
import { useAppSelector } from '../../../redux/store';
import { LinearGradient } from 'expo-linear-gradient';
import { SIZES } from '../../../constants';
import Row from '../../../components/Row';
import { FontAwesome } from '@expo/vector-icons';
import RadioButton from '../../../components/RadioButton';
import { P_Size } from '../../../utils/sizes';
import Button from '../../../components/Button';
import Quantifier from '../../../components/Quantifier';
import { AnimatePresence, MotiView } from 'moti';

type Props = NativeStackScreenProps<ConsumerHomeStackScreens, 'ProductDetails'>;

const ProductDetails = ({
   route: {
      params: { product }
   },
   navigation
}: Props) => {
   const theme = useAppSelector((state) => state.theme);

   const [selected, setSelected] = React.useState<P_Size | null>(null);
   const [quantity, setQuatity] = React.useState<number>(1);

   const handleAddToCart = () => {};
   return (
      <View style={{ flex: 1, backgroundColor: theme.BACKGROUND_COLOR }}>
         <ImageBackground
            source={{ uri: product.image! }}
            resizeMode="cover"
            style={[styles.image]}
         >
            <LinearGradient
               colors={[
                  'rgba(0,0,0,0.1)',
                  'rgba(0,0,0,0.3)',
                  'rgba(0,0,0,0.7)'
               ]}
               start={{ x: 0, y: 0.3 }}
               end={{ x: 1, y: 0.8 }}
               style={[styles.back]}
            >
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <FontAwesome
                     name="chevron-left"
                     size={24}
                     color={theme.WHITE_COLOR}
                  />
               </TouchableOpacity>
            </LinearGradient>
            <LinearGradient
               colors={[
                  'rgba(0,0,0,0.1)',
                  'rgba(0,0,0,0.4)',
                  'rgba(0,0,0,0.8)'
               ]}
               start={{ x: 0, y: 0.3 }}
               end={{ x: 1, y: 0.6 }}
               style={[styles.name]}
            >
               <Row horizontalAlign="space-between">
                  <Text
                     numberOfLines={1}
                     ellipsizeMode="tail"
                     lightText
                     large
                     lobster
                  >
                     {product.name}
                  </Text>
                  <Text bold large lightText>
                     ${selected ? selected.price : product.price}
                  </Text>
               </Row>
            </LinearGradient>
         </ImageBackground>
         <AnimatePresence>
            {product.sizes && product.sizes.length === 0 && (
               <>
                  <Text py_4 bold center>
                     Qty
                  </Text>
                  <Quantifier
                     onPressLeft={() => {
                        setQuatity((prev) => {
                           if (prev > 1) return prev - 1;
                           return 1;
                        });
                     }}
                     onPressRight={() => {
                        setQuatity((prev) => {
                           return prev + 1;
                        });
                     }}
                     quantity={quantity}
                  />
               </>
            )}
         </AnimatePresence>
         <ScrollView style={{ padding: SIZES.base, flex: 1 }}>
            <View style={{ padding: SIZES.padding }}>
               <Text medium py_6 raleway_italic>
                  {product.description}
               </Text>
            </View>
            {product.sizes && product.sizes.length > 0 && (
               <View>
                  <Text raleway_bold medium center>
                     Pick a Size
                  </Text>
                  <Row
                     horizontalAlign="space-evenly"
                     containerStyle={{ paddingVertical: 30 }}
                  >
                     {product.sizes &&
                        product.sizes.length > 0 &&
                        product.sizes
                           .sort((a, b) => (a.id > b.id ? 1 : -1))
                           .reverse()
                           .map((size, index) => (
                              <Row>
                                 <Text
                                    bold={selected === size}
                                    capitalize
                                    raleway
                                    px_4
                                 >
                                    {size.size}
                                 </Text>
                                 <RadioButton
                                    selected={selected === size}
                                    onPress={() => {
                                       setSelected(size);
                                    }}
                                 />
                              </Row>
                           ))}
                  </Row>
               </View>
            )}
         </ScrollView>
         <View style={[styles.btn]}>
            <Button
               disabled={
                  product.sizes && product.sizes.length > 0 && selected === null
               }
               containerStyle={{ paddingVertical: SIZES.padding * 0.8 }}
               title={`Add to Cart`}
               onPress={handleAddToCart}
            />
         </View>
      </View>
   );
};

export default ProductDetails;
const styles = StyleSheet.create({
   name: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      paddingHorizontal: SIZES.base,
      paddingVertical: SIZES.padding
   },
   back: {
      position: 'absolute',
      top: SIZES.statusBarHeight,
      left: 20,
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center'
   },
   image: {
      width: '100%',
      height: SIZES.height * 0.4
   },
   btn: {
      position: 'absolute',
      bottom: 30,
      alignSelf: 'center',
      width: '80%'
   }
});
