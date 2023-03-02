import { View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from 'react-native-chart-kit';

import { useAppSelector } from '../../../redux/store';
import { SIZES } from '../../../constants';
import { businessProperty } from '../../../utils/businessProperty';
import { useBusinessOrders } from '../../../hooks/useBusinessOrders';
import moment from 'moment';
import { Order } from '../../../redux/consumer/ordersSlide';
const line = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            data: [20, 45, 28, 80, 99, 43, 85],
            strokeWidth: 2
            // optional
        }
    ]
};
const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
        {
            data: [192, 45, 28, 80, 99, 250]
        }
    ]
};

type Props = {};

interface Data {
    labels: string[];
    datasets: [{ data: number[]; strokeWidth?: number }];
}

const Earnings = (props: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const { orders, loading } = useBusinessOrders();
    const data2 = businessProperty({
        orders,
        property: 'delivered'
    }) as Order[];
    const data1 = businessProperty({
        orders,
        property: 'picked_up_by_client'
    }) as Order[];
    const data = [...data2, ...data1];

    const ld: Data = {
        labels: [
            ...new Set([
                ...data.map((d) => {
                    return moment(d.orderDate).format('MMMM');
                })
            ])
        ],

        datasets: [{ data: [90] }]
    };
    const thisWeekData: Data = {
        labels: [
            ...new Set([
                ...data.map((d) => {
                    return moment(d.orderDate).format('dddd');
                })
            ])
        ],
        datasets: [{ data: [98, 325, 500, 200] }]
    };
    console.log(thisWeekData);

    // const lineData = data.map((d) => {
    //     return {
    //         labels: [...new Set([moment(d.orderDate).format('MMM')])],
    //         datasets: [{ data: [96] }]
    //     };
    // });
    // console.log(lineData);

    return (
        <Screen>
            <View>
                <LineChart
                    data={line}
                    width={SIZES.width * 0.9} // from react-native
                    height={SIZES.height * 0.2}
                    yAxisLabel={'$'}
                    chartConfig={{
                        backgroundColor: theme.BACKGROUND_COLOR,
                        backgroundGradientFrom: theme.ASCENT,
                        backgroundGradientTo: theme.CARD_BACKGROUND,
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) =>
                            `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: SIZES.radius
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: SIZES.padding,
                        borderRadius: SIZES.radius,
                        alignSelf: 'center'
                    }}
                />
                <BarChart
                    yAxisSuffix=""
                    style={{
                        marginVertical: SIZES.padding,
                        borderRadius: SIZES.radius,
                        alignSelf: 'center'
                    }}
                    data={thisWeekData}
                    width={SIZES.width * 0.9}
                    height={SIZES.height * 0.2}
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
            </View>
        </Screen>
    );
};

export default Earnings;
