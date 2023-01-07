import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useAppSelector } from '../../../redux/store';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../components/Header';
import Stack from '../../../components/Stack';
import Row from '../../../components/Row';
import { FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';
import ProductListItem from '../../../components/ProductListItem';
import { SIZES } from '../../../constants';
import { stripeFee } from '../../../utils/stripeFee';
import Divider from '../../../components/Divider';
import Button from '../../../components/Button';
import PaymentLoading from '../../../components/PaymentLoading';

import { usePayment } from '../../../hooks/usePayment';

type Props = {};

const Checkout = ({}: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const navigation = useNavigation();
    const { order } = useAppSelector((state) => state.orders);
    const { total, items, quantity } = useAppSelector((state) => state.cart);
    const { loading, startPayment } = usePayment();

    if (loading) return <PaymentLoading />;
    return (
        <Screen>
            <StripeProvider
                publishableKey={process.env.STRIPE_TEST_PK!}
                merchantIdentifier="net.robertdev.deli.app"
                threeDSecureParams={{
                    backgroundColor: theme.BACKGROUND_COLOR,
                    timeout: 8
                }}
            >
                <Header
                    title="Checkout"
                    onPressBack={() => navigation.goBack()}
                />
                <Container
                    style={{
                        justifyContent: 'space-between',
                        flexGrow: 1
                    }}
                >
                    <ScrollView>
                        <View>
                            <Section>
                                <Row horizontalAlign="space-between">
                                    <Stack>
                                        <Text bold>Your information</Text>
                                        <Text>
                                            {order?.contactPerson.name}{' '}
                                            {order?.contactPerson.lastName}
                                        </Text>
                                        <Text>
                                            {order?.contactPerson.phone}
                                        </Text>
                                    </Stack>
                                    <FontAwesome
                                        name="chevron-right"
                                        size={18}
                                        color={theme.TEXT_COLOR}
                                    />
                                </Row>
                            </Section>
                            <Section onPress={() => navigation.goBack()}>
                                <Row
                                    containerStyle={{ width: '100%' }}
                                    horizontalAlign="space-between"
                                >
                                    <Stack>
                                        <Text bold>Delivery To</Text>
                                        <Text>
                                            {order?.address?.street.substring(
                                                0,
                                                order.address.street.length - 5
                                            )}
                                        </Text>
                                        {order?.address?.apt && (
                                            <Text>Apt {order.address.apt}</Text>
                                        )}
                                    </Stack>
                                    <FontAwesome
                                        name="chevron-right"
                                        size={18}
                                        color={theme.TEXT_COLOR}
                                    />
                                </Row>
                            </Section>
                            {order?.deliveryInstructions && (
                                <Section onPress={() => navigation.goBack()}>
                                    <Row
                                        containerStyle={{ width: '100%' }}
                                        horizontalAlign="space-between"
                                    >
                                        <Stack>
                                            <Text bold>
                                                Delivery Instructions
                                            </Text>
                                            <Text>
                                                {order.deliveryInstructions}
                                            </Text>
                                        </Stack>
                                        <FontAwesome
                                            name="chevron-right"
                                            size={18}
                                            color={theme.TEXT_COLOR}
                                        />
                                    </Row>
                                </Section>
                            )}
                            <View
                                style={{
                                    paddingHorizontal: SIZES.padding,
                                    maxHeight: '40%'
                                }}
                            >
                                <>
                                    <Divider />
                                    <Text raleway_bold medium center py_4>
                                        {quantity}{' '}
                                        {quantity > 1 ? 'items' : 'item'}
                                    </Text>
                                    {items.map((item, index) => (
                                        <ProductListItem
                                            key={index.toString()}
                                            item={item}
                                            index={index}
                                        />
                                    ))}
                                </>
                            </View>
                        </View>
                    </ScrollView>
                    <Princing>
                        <Row horizontalAlign="space-between">
                            <Text left>sub-total </Text>
                            <Text>${total.toFixed(2)}</Text>
                        </Row>

                        <Row horizontalAlign="space-between">
                            <Text>service fee</Text>
                            <Text>${stripeFee(total)}</Text>
                        </Row>
                        <Row horizontalAlign="space-between">
                            <Text bold medium>
                                {' '}
                                Total
                            </Text>
                            <Text py_4 left bold medium>
                                ${(total + stripeFee(total)).toFixed(2)}
                            </Text>
                        </Row>
                    </Princing>
                    <Footer
                        style={{
                            alignSelf: 'center',
                            width: '60%'
                        }}
                    >
                        <Button
                            disabled={loading}
                            isLoading={loading}
                            title="Place Order"
                            outlined
                            onPress={startPayment}
                        />
                    </Footer>
                </Container>
            </StripeProvider>
        </Screen>
    );
};

export default Checkout;

const Section = styled.TouchableOpacity`
    background-color: ${(props) => props.theme.BACKGROUND_COLOR};
    margin: 6px 0px
    shadow-opacity: 0.4;
    shadow-radius: 3px;
    shadow-box: 4px 4px 6px ${(props) => props.theme.SHADOW_COLOR};
`;

const Footer = styled.View`
    padding: ${SIZES.base * 2}px;
    height: 10%;
`;
const Container = styled.View``;
const Princing = styled.View`
    width: 100%;
    padding: ${SIZES.base * 2}px;
`;

const styles = StyleSheet.create({
    section: {}
});
