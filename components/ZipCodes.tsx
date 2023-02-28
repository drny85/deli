import { Alert, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Row from './Row';
import InputField from './InputField';
import Text from './Text';
import Button from './Button';
import { SIZES } from '../constants';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { AnimatePresence, MotiView } from 'moti';
import { FontAwesome } from '@expo/vector-icons';
import { updateBusiness } from '../redux/business/businessActions';
import { useBusiness } from '../hooks/useBusiness';
type Props = {
    zips: number[];
};

const ZipCodes = ({ zips }: Props) => {
    const { user } = useAppSelector((state) => state.auth);
    const [zipcodes, setZipcodes] = useState<number[]>([]);
    const [zip, setZip] = useState<string>('');
    const theme = useAppSelector((state) => state.theme);
    const [updating, setUpdating] = useState(false);
    const [btnTitle, setBtnTitle] = useState('Add Zipcode');
    const dispatch = useAppDispatch();
    const { business } = useBusiness(user?.id!);

    const handleDeleteZip = (value: number) => {
        const found = zipcodes.find((zip) => zip === value);
        if (found) {
            Alert.alert(
                'Delete Zip',
                `Are you sure you want to delete ${found}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Yes, Detele it',
                        onPress: () =>
                            setZipcodes((prev) => {
                                const newZips = prev.filter((z) => z !== found);
                                handleZipsUpdates(newZips);
                                return newZips;
                            })
                    }
                ]
            );
        }
    };

    const handleZipsUpdates = async (values: number[]) => {
        try {
            dispatch(updateBusiness({ ...business!, zips: values }));
        } catch (error) {
            console.log('Error updating zips', error);
        }
    };

    const handleUpdate = () => {
        if (!updating) {
            setUpdating(true);
            setBtnTitle('Update Zips');
        } else {
            console.log('HERE');
            if (!zip || zip.length !== 5) {
                Alert.alert('Pleaser Enter a Zip code');
                return;
            }
            const found = zipcodes.findIndex((z) => z === +zip);
            if (found === -1) {
                setZipcodes([...zipcodes, +zip]); //])
                setUpdating(false);
                setZip('');
                handleZipsUpdates([...zipcodes, +zip]);
            } else {
                Alert.alert(`${zip} is already in there`);
                setZip('');
                return;
            }
        }
    };

    useEffect(() => {
        if (!zips.length) return;
        setZipcodes(zips);
        setBtnTitle('Update Zips');
    }, [zips]);

    return (
        <View>
            <Row horizontalAlign="space-between">
                <Text bold>Delivery Zip Codes</Text>
                <View style={{ width: '40%' }}>
                    <AnimatePresence>
                        {updating && (
                            <MotiView
                                from={{
                                    opacity: 0,
                                    translateY: -10,
                                    height: 0
                                }}
                                animate={{
                                    opacity: 1,
                                    translateY: 0,
                                    height: 80
                                }}
                                transition={{ type: 'timing' }}
                                exit={{
                                    opacity: 0,
                                    translateY: -10,
                                    height: 0
                                }}
                            >
                                <InputField
                                    p_y={8}
                                    contentStyle={{ textAlign: 'center' }}
                                    mainStyle={{
                                        width: '60%',
                                        alignSelf: 'center'
                                    }}
                                    value={zip}
                                    keyboardType="numeric"
                                    onChangeText={setZip}
                                    placeholder="Type Zip Code"
                                    maxLenght={5}
                                />
                            </MotiView>
                        )}
                    </AnimatePresence>

                    <View
                        style={{
                            flexWrap: 'wrap',
                            width: '100%',
                            flexDirection: 'row',
                            borderRadius: SIZES.radius,
                            borderWidth: zipcodes.length ? 0.5 : 0,
                            borderColor: theme.ASCENT
                        }}
                    >
                        {zipcodes.map((z, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleDeleteZip(z)}
                                style={{
                                    borderRadius: 10,
                                    borderColor: theme.ASCENT,
                                    borderWidth: 1,
                                    padding: 4,
                                    margin: 4
                                }}
                            >
                                <Row>
                                    <Text px_4 key={index}>
                                        {z}
                                    </Text>
                                    <FontAwesome
                                        name="close"
                                        size={20}
                                        color={theme.TEXT_COLOR}
                                    />
                                </Row>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <Row>
                    <Button
                        outlined
                        containerStyle={{ borderRadius: 10 }}
                        title={btnTitle}
                        onPress={handleUpdate}
                    />
                </Row>
            </Row>
        </View>
    );
};

export default ZipCodes;
