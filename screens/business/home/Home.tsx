import { StyleSheet, View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useBusiness } from '../../../hooks/useBusiness';
import { useAppSelector } from '../../../redux/store';
import Loader from '../../../components/Loader';
import Button from '../../../components/Button';
import { useNavigation } from '@react-navigation/native';

type Props = {};

const Home = ({}: Props) => {
    const { user } = useAppSelector((state) => state.auth);
    const { business } = useBusiness(user?.id!);
    const navigation = useNavigation();

    if (!business) return <Loader />;
    return (
        <Screen>
            {!business.profileCompleted ||
            business.stripeAccount === null ||
            !business.isActive ? (
                <View
                    style={[
                        styles.container,
                        { justifyContent: 'center', alignItems: 'center' }
                    ]}
                >
                    <Text py_8>
                        Your business is not ready yet. You must add some
                        products to sell
                    </Text>
                    <Button
                        title="Manage Products"
                        onPress={() => {
                            navigation.navigate('BusinessProducts', {
                                screen: 'Products'
                            });
                        }}
                    />
                </View>
            ) : (
                <View style={styles.container}></View>
            )}
        </Screen>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
