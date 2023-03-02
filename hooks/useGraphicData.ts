import moment from "moment";
import { useEffect, useState } from "react";
import { Order } from "../redux/consumer/ordersSlide";
import { GraphicData, GraphicDataValue } from "../types";

type Range = 'week' | 'month';
type Props ={
    orders:Order[],
    range:Range
}
export const useGraphicData = ({orders, range}:Props) => {
    const x: GraphicDataValue = {};
    const [data, setData] = useState<GraphicData>()
   
    const days = range === 'week' ? 'dddd' :'MMMM'
     orders
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

    const thisWeekData: GraphicData = {
        labels: Object.keys(x),
        datasets: [{ data: Object.values(x) }]
    };

    console.log('D',orders);
   

    useEffect(() => {
        setData(thisWeekData)
    }, [thisWeekData])

    return {data}
}