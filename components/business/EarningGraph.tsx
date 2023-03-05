import { View, ViewStyle, StyleProp } from 'react-native';
import React from 'react';
import { GraphicData, GraphicType, PieGraphicValue } from '../../types';
import { useAppSelector } from '../../redux/store';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { SIZES } from '../../constants';
import Text from '../Text';
import Loader from '../Loader';

type Props = {
    title: string;
    data: GraphicData | PieGraphicValue[];
    type: GraphicType;
    containerStyle?: StyleProp<ViewStyle>;
};

const EarningGraph = ({ title, data, type, containerStyle }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    if (!data) return <Loader />;
    return (
        <View style={containerStyle}>
            <Text center lobster large>
                {title}
            </Text>
            {type === 'Line Chart' && (
                <LineChart
                    data={data as GraphicData}
                    width={SIZES.width * 0.9} // from react-native
                    height={SIZES.height * 0.2}
                    yAxisLabel={'$'}
                    chartConfig={{
                        backgroundColor: theme.ASCENT,
                        backgroundGradientFrom: theme.ASCENT,
                        backgroundGradientTo: theme.CARD_BACKGROUND,
                        // backgroundGradientToOpacity: 0.8,
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) =>
                            `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: SIZES.radius
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: SIZES.base,
                        borderRadius: SIZES.radius,
                        alignSelf: 'center'
                    }}
                />
            )}

            {type === 'Bar Chart' && (
                <BarChart
                    yAxisSuffix=""
                    style={{
                        marginVertical: SIZES.base,
                        borderRadius: SIZES.radius,
                        alignSelf: 'center'
                    }}
                    data={data as GraphicData}
                    width={SIZES.width * 0.5}
                    height={SIZES.height * 0.3}
                    yAxisLabel={'$'}
                    chartConfig={{
                        backgroundColor: theme.BACKGROUND_COLOR,
                        backgroundGradientFrom: theme.ASCENT,
                        backgroundGradientTo: theme.CARD_BACKGROUND,
                        decimalPlaces: 2,
                        labelColor: (opacity = 1) => theme.WHITE_COLOR,
                        // optional, defaults to 2dp
                        color: (opacity = 1) => theme.BACKGROUND_COLOR,
                        style: {
                            borderRadius: SIZES.radius
                        }
                    }}
                />
            )}

            {type === 'Pie Chart' && (
                <PieChart
                    paddingLeft="0"
                    data={data as PieGraphicValue[]}
                    width={SIZES.width * 0.5}
                    height={SIZES.height * 0.2}
                    chartConfig={{
                        backgroundColor: theme.ASCENT,
                        backgroundGradientFrom: theme.ASCENT,
                        backgroundGradientToOpacity: 0.5,
                        backgroundGradientTo: theme.CARD_BACKGROUND,
                        barRadius: 0.4,
                        barPercentage: 0.4,
                        decimalPlaces: 2,
                        labelColor: (opacity = 1) => theme.ASCENT,
                        // optional, defaults to 2dp
                        color: (opacity = 1) => theme.BACKGROUND_COLOR,
                        style: {
                            borderRadius: SIZES.radius
                        }
                    }}
                    xLabelsOffset={20}
                    accessor={'units'}
                    backgroundColor={theme.BACKGROUND_COLOR}
                    center={[0, 0]}
                    avoidFalseZero
                    absolute
                />
            )}
        </View>
    );
};

export default EarningGraph;
