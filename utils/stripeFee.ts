import { ORDER_TYPE } from '../redux/consumer/ordersSlide';
import { useAppSelector } from '../redux/store';

export const stripeFee = (
    amount: number,
    orderType: keyof typeof ORDER_TYPE
): number => {
    if (!amount) return 0;
    const myFee = orderType === ORDER_TYPE.delivery ? 0.3 : 0.5;
    const stripeCharge = 0.3;
    const fee = myFee + stripeCharge;
    const p = (amount * 2.9) / 100 + fee;

    return +p.toFixed(2);
};
