import {
    Animated,
    FlatList,
    Image,
    ListRenderItem,
    Modal,
    Platform,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import Text from './Text';
import Header from './Header';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { ORDER_TYPE, tooglePickupMap } from '../redux/consumer/ordersSlide';

import { Business, setBusiness } from '../redux/business/businessSlide';
import MapView, {
    Marker,
    MarkerPressEvent,
    PROVIDER_GOOGLE,
    Region
} from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import { customMapStyleDark, customMapStyleLight } from '../utils/customMap';
import { IMAGE_PLACEHOLDER, SIZES } from '../constants';
import Stack from './Stack';
import Button from './Button';
import { MotiImage, MotiView } from 'moti';
import Row from './Row';
import { switchTheme } from '../redux/themeSlide';
import { darkTheme, lightTheme } from '../Theme';

const CARD_HEIGHT = 220;
const CARD_WIDTH = SIZES.width * 0.8;
const INSET = SIZES.width * 0.1 - 10;
let TIME_OUT: NodeJS.Timeout;

type Props = {
    businesses: Business[];
};

const PickupMap = ({ businesses }: Props) => {
    const navigation = useNavigation();
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();
    const [mapTheme, setMapTheme] = useState<typeof theme.mode>('light');
    const mapRef = useRef<MapView>(null);
    const flatListRef = useRef<FlatList>(null);
    const { orderType, showPickupMap } = useAppSelector(
        (state) => state.orders
    );
    const [index, setIndex] = useState<number>(0);
    const [viewPosition, setViewPosition] = useState<number>(0.5);
    const [region, setRegion] = useState<Region>();
    let animatedX = new Animated.Value(0);
    let mapIndex = 0;

    const centerMap = () => {
        mapRef.current?.fitToElements({
            animated: true,
            edgePadding: {
                left: 50,
                right: 50,
                top: 100,
                bottom: 300
            }
        });
    };

    const renderBusinesses: ListRenderItem<Business> = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => setIndex(index)}
                style={[
                    styles.card,
                    {
                        shadowColor: theme.SHADOW_COLOR,
                        backgroundColor: theme.CARD_BACKGROUND
                    }
                ]}
            >
                <View style={{ height: '100%' }}>
                    <Image
                        source={{ uri: item.image || IMAGE_PLACEHOLDER }}
                        style={styles.img}
                        resizeMode="cover"
                    />
                    <Stack
                        py={4}
                        px={6}
                        containerStyle={{ flexGrow: 1, height: '100%' }}
                    >
                        <Text lobster medium>
                            {item.name}
                        </Text>
                        <Text py_4>{item.address?.slice(0, -10)}</Text>

                        <Button
                            small
                            outlined
                            containerStyle={{ alignSelf: 'center' }}
                            title="Order Now"
                            onPress={() => {
                                dispatch(setBusiness(item));
                                dispatch(tooglePickupMap(false));
                                navigation.navigate('ConsumerHome', {
                                    screen: 'BusinessPage'
                                });
                            }}
                        />
                    </Stack>
                </View>
            </TouchableOpacity>
            //<BusinessCard business={item} onPress={() => {}} />
        );
    };
    useEffect(() => {
        const sub = animatedX.addListener(({ value }) => {
            // console.log('V', value);
            let i = Math.floor(value / CARD_WIDTH + 0.3);

            if (i > businesses.length) {
                i = businesses.length - 1;
            }
            if (i < 0) {
                i = 0;
            }
            clearTimeout(TIME_OUT);

            TIME_OUT = setTimeout(() => {
                if (mapIndex !== i) {
                    mapIndex = i;
                    const { coors } = businesses[i];
                    mapRef.current?.animateToRegion(
                        {
                            latitude: coors?.lat!,
                            longitude: coors?.lng!,
                            latitudeDelta: region?.latitudeDelta!,
                            longitudeDelta: region?.longitudeDelta!
                        },
                        350
                    );
                }
            }, 350);
        });

        return () => {
            animatedX.removeListener(sub);
        };
    });

    useEffect(() => {
        flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewOffset: index === 0 ? 20 : 10,
            viewPosition: viewPosition
        });

        // mapRef.current?.animateToRegion();
    }, [index, viewPosition]);
    useEffect(() => {
        if (!businesses.length) return;
        const coors = businesses[0].coors;
        setRegion({
            latitude: coors?.lat!,
            longitude: coors?.lng!,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        });
    }, [businesses.length]);
    return (
        <Modal
            visible={orderType === ORDER_TYPE.pickup && showPickupMap}
            presentationStyle="overFullScreen"
            animationType="slide"
        >
            <StatusBar
                barStyle={
                    mapTheme === 'dark' ? 'light-content' : 'dark-content'
                }
            />
            <View style={{ flex: 1 }}>
                <Header
                    iconColor={
                        mapTheme === 'dark' ? theme.WHITE_COLOR : '#212121'
                    }
                    titleColor={
                        mapTheme === 'dark' ? theme.WHITE_COLOR : '#212121'
                    }
                    containerStyle={{
                        zIndex: 300,
                        position: 'absolute',
                        paddingTop: SIZES.statusBarHeight,
                        width: '100%'
                    }}
                    title="Nearby Restaurants"
                    onPressBack={() => {
                        dispatch(tooglePickupMap(false));
                    }}
                    rightIcon={
                        <Row>
                            <TouchableOpacity
                                style={{ padding: 10 }}
                                onPress={() => {
                                    centerMap();
                                }}
                            >
                                <Ionicons
                                    name="locate-outline"
                                    size={30}
                                    color={
                                        mapTheme === 'dark'
                                            ? theme.WHITE_COLOR
                                            : '#212121'
                                    }
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ padding: 10 }}
                                onPress={() => {
                                    setMapTheme((prev) =>
                                        prev === 'dark' ? 'light' : 'dark'
                                    );
                                }}
                            >
                                <Ionicons
                                    name={
                                        theme.mode === 'dark'
                                            ? 'sunny-outline'
                                            : 'moon-outline'
                                    }
                                    size={30}
                                    color={
                                        mapTheme === 'dark'
                                            ? theme.WHITE_COLOR
                                            : '#212121'
                                    }
                                />
                            </TouchableOpacity>
                        </Row>
                    }
                />
                <View style={{ flex: 0.8 }}>
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        zoomEnabled
                        zoomControlEnabled
                        showsUserLocation
                        customMapStyle={
                            mapTheme === 'dark'
                                ? customMapStyleDark
                                : customMapStyleLight
                        }
                        region={region}
                        style={{ height: '100%' }}
                        // onRegionChange={(region) => {
                        //     setRegion(region);
                        // }}
                        onMapReady={(e) => {
                            mapRef.current?.fitToElements({
                                animated: true,
                                edgePadding: {
                                    left: 50,
                                    right: 50,
                                    bottom: 300,
                                    top: 100
                                }
                            });
                        }}
                    >
                        {businesses.map((b, i) => {
                            return (
                                <Marker
                                    onPress={(e: MarkerPressEvent) => {
                                        const coors = e.nativeEvent.coordinate;
                                        const id = e.nativeEvent.id;
                                        setIndex(+id);
                                        mapRef.current?.animateToRegion({
                                            latitude: coors.latitude,
                                            longitude: coors.longitude,
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0425
                                        });
                                    }}
                                    key={b.id}
                                    identifier={index.toString()}
                                    title={b.name}
                                    description={b.address?.slice(0, -10)}
                                    coordinate={{
                                        latitude: b.coors?.lat!,
                                        longitude: b.coors?.lng!
                                    }}
                                >
                                    <MotiView
                                        from={{
                                            backgroundColor:
                                                theme.BACKGROUND_COLOR
                                        }}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 40,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <MotiImage
                                            animate={{
                                                scale: index === i ? 1.9 : 1,
                                                width: index === i ? 100 : 80,
                                                height: index === i ? 100 : 80,
                                                borderRadius:
                                                    index === i ? 50 : 40
                                            }}
                                            // style={{
                                            //     height: 80,
                                            //     width: 80,
                                            //     borderRadius: 40,
                                            //     overflow: 'hidden'
                                            // }}
                                            source={{ uri: IMAGE_PLACEHOLDER }}
                                        />
                                    </MotiView>
                                </Marker>
                            );
                        })}
                    </MapView>
                </View>
                <MotiView
                    from={{ height: 0, opacity: 0 }}
                    animate={{ height: SIZES.height * 0.3, opacity: 1 }}
                    transition={{ type: 'timing', duration: 500, delay: 200 }}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: theme.BACKGROUND_COLOR,
                        borderTopLeftRadius: SIZES.radius * 2,
                        borderTopRightRadius: SIZES.radius * 0.2
                    }}
                >
                    <Animated.FlatList
                        ref={flatListRef}
                        data={[...businesses]}
                        contentContainerStyle={{
                            paddingRight: Platform.OS === 'android' ? INSET : 0
                        }}
                        pagingEnabled
                        contentInset={{
                            left: INSET,
                            right: INSET,
                            top: 0,
                            bottom: 0
                        }}
                        onScroll={Animated.event(
                            [
                                {
                                    nativeEvent: {
                                        contentOffset: { x: animatedX }
                                    }
                                }
                            ],
                            { useNativeDriver: true }
                        )}
                        snapToAlignment={'center'}
                        snapToInterval={CARD_WIDTH + 20}
                        initialScrollIndex={0}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        //style={styles.scrollView}
                        keyExtractor={(item, index) =>
                            index.toString() + item.id
                        }
                        renderItem={renderBusinesses}
                    />
                </MotiView>
            </View>
        </Modal>
    );
};

export default PickupMap;

const styles = StyleSheet.create({
    card: {
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        height: CARD_HEIGHT,
        marginHorizontal: 10,
        width: CARD_WIDTH,
        borderRadius: SIZES.radius * 2,
        overflow: 'hidden',
        elevation: 6
    },
    scrollView: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        paddingVertical: 10
    },
    img: {
        width: '100%',
        height: '50%',
        borderTopLeftRadius: SIZES.radius * 2,
        borderTopEndRadius: SIZES.radius * 2
    }
});
