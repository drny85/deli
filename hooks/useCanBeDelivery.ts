import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/store';

export const useCanBeDelivery = () => {
    const [canBe, setCanBe] = useState(true);
    const { deliveryZip } = useAppSelector((state) => state.orders);
    const { business } = useAppSelector((state) => state.business);
    useEffect(() => {
        if (!business || !deliveryZip || !business.isOpen) {
            setCanBe(false);
            return;
        }
        if (business.zips) {
            if (business.zips.includes(deliveryZip)) {
                setCanBe(true);
            } else {
                setCanBe(false);
            }
        }
    }, [business, deliveryZip]);

    return canBe;
};
