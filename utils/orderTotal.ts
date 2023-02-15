import { stripeFee } from './stripeFee';

export const orderTotal = (
    total: number,
    tip: number,
    orderType: 'delivery' | 'pickup'
): number => {
    let t = 0;
    if (tip) {
        t = tip;
    }
    if (orderType === 'delivery') {
        return +(total + stripeFee(total) + t).toFixed(2);
    }

    return +(total + stripeFee(total)).toFixed(2);
};
