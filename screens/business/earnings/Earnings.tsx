import { View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import { useGraphicData } from '../../../hooks/useGraphicData';
import EarningGraph from '../../../components/business/EarningGraph';
import Loader from '../../../components/Loader';
import Header from '../../../components/Header';
import Text from '../../../components/Text';
import { TOP_UNITS } from '../../../constants';

const Earnings = () => {
    const {
        data: thisWeek,
        categoriesData: categoriesThisWeek,
        loadingStatus: lw
    } = useGraphicData({
        range: 'week'
    });
    const {
        data: thisMonth,
        categoriesData: categoriesThisMonth,
        loadingStatus: lm
    } = useGraphicData({
        range: 'month'
    });

    const {
        data: thisYear,
        categoriesData: categoriesThisYear,
        loadingStatus: ty
    } = useGraphicData({
        range: 'year'
    });

    //console.log(thisWeekData);
    if (thisYear.labels.length === 0)
        return (
            <Screen center>
                <Text>No Data to show</Text>
            </Screen>
        );
    return (
        <Screen>
            <Header title="Earnings By The Numbers" />
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text medium raleway_bold>
                    Top {TOP_UNITS} Items This Week
                </Text>
                <View
                    style={{
                        flex: 0.4,
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-evenly'
                    }}
                >
                    {categoriesThisWeek.length > 0 && (
                        <EarningGraph
                            type="Pie Chart"
                            data={categoriesThisWeek as any}
                            title="Units Sold This Week"
                        />
                    )}

                    <EarningGraph
                        type="Pie Chart"
                        data={categoriesThisMonth as any}
                        title="Units Sold This Month"
                    />
                </View>

                <View style={{ flex: 0.5 }}>
                    {thisWeek.labels.length > 0 && (
                        <EarningGraph
                            data={thisWeek}
                            type="Line Chart"
                            title="Earning By Day This Week"
                        />
                    )}

                    <EarningGraph
                        data={thisYear}
                        type="Line Chart"
                        title="Earning By Month This Year"
                    />
                </View>
            </View>
        </Screen>
    );
};

export default Earnings;
