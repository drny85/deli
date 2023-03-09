import moment from 'moment';
import { useEffect, useState } from 'react';
import { MY_TRANSACTION_FEE, TOP_UNITS } from '../constants';
import { ORDER_STATUS } from '../redux/consumer/ordersSlide';
import { useAppSelector } from '../redux/store';
import { GraphicData, GraphicDataValue } from '../types';
import { useBusinessOrders } from './useBusinessOrders';

type Range = 'week' | 'month' | 'year';
type Props = {
    range: Range;
};

export interface CategoryGraphicData {
    name: string;
    units: number;
}
export const useGraphicData = ({ range }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const x: GraphicDataValue = {};
    const y: { name: string; quantity: number }[] = [];
    const z: GraphicDataValue = {};
    const [loadingStatus, setLoading] = useState(true);
    const { orders } = useBusinessOrders();
    const days = range === 'week' ? 'dddd' : range === 'year' ? 'MMMM' : 'YYYY';
    const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

    orders
        .filter((d) =>
            moment(d.orderDate).isBetween(
                moment().startOf(range),
                moment().endOf(range)
            )
        )
        .filter(
            (o) =>
                o.status === ORDER_STATUS.delivered ||
                o.status === ORDER_STATUS.picked_up_by_client
        )
        .map((o) => o.items)
        .map((i) => i.map((r) => ({ name: r.name, quantity: r.quantity })))
        .forEach((a) => {
            a.forEach((d) => {
                y.push(d);
            });
        });

    y.forEach((_, index) => {
        const i = y[index].name;
        const q = y[index].quantity;

        if (z[i]) {
            z[i] = z[i] + q;
        } else {
            z[i] = q;
        }
    });
    const categoriesData = Object.entries(z)
        .map((k, v) => {
            //console.log(k, v);
            return {
                name: k[0],
                units: k[1],
                color: `#${randomColor()}`,
                legendFontColor: theme.TEXT_COLOR,
                legendFontSize: 15
            };
        })
        .sort((a, b) => (a.units < b.units ? 1 : -1))
        .slice(0, TOP_UNITS);
    //console.log(result);

    orders
        .filter((d) =>
            moment(d.orderDate).isBetween(
                moment().startOf(range),
                moment().endOf(range)
            )
        )
        .filter(
            (o) =>
                o.status === ORDER_STATUS.delivered ||
                o.status === ORDER_STATUS.picked_up_by_client
        )
        .map((d) => ({
            property: moment(d.orderDate).format(days),
            total: d.total
        }))
        .forEach((v) => {
            if (x[v.property]) {
                x[v.property] = x[v.property] + v.total;
            } else {
                x[v.property] = v.total;
            }
        });

    const data: GraphicData = {
        labels: Object.keys(x),
        datasets: [
            {
                data: Object.values(x).map(
                    (v) => +(v - (v * MY_TRANSACTION_FEE) / 100).toFixed(2)
                )
            }
        ]
    };

    useEffect(() => {
        // if (!data.datasets[0].data.length || !categoriesData.length) return;
        //console.log(result);
        // setCategoryGrapgicData(result);
        console.log('EF');
        setLoading(false);

        // if (result) {
        //     setCategoryGrapgicData(result);
        //     setLoading(false);
        // }
    }, [data.datasets[0].data.length, categoriesData.length]);

    // console.log('D', data);

    return { data, categoriesData, loadingStatus };
};
