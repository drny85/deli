import moment from 'moment';
import { Order, ORDER_STATUS } from '../redux/consumer/ordersSlide';
import { Courier } from '../types';

type Props = {
    orders: Order[];
    property: 'deliveredBy' | keyof typeof ORDER_STATUS;
    fromTodayOnly?: boolean;
};

export const businessProperty = ({
    orders,
    property,
    fromTodayOnly
}: Props): Courier[] | Order[] => {
    if (orders.length > 0) {
        if (property === 'deliveredBy') {
            return orders
                .filter(
                    (order) =>
                        order.status === ORDER_STATUS.delivered &&
                        order.deliveredBy !== null
                )
                .map((o) => o.deliveredBy!);
        } else if (fromTodayOnly) {
            return orders.filter(
                (order) =>
                    order.status === property &&
                    moment(order.orderDate)
                        .startOf('day')
                        .isSame(moment().startOf('day'))
            );
        } else {
            return orders.filter((order) => order.status === property);
        }
    }

    return [];
};
