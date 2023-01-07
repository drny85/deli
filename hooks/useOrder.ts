import { doc, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ordersCollection } from '../firebase';
import { Order } from '../redux/consumer/ordersSlide';

export const useOrder = (orderId: string) => {
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (!orderId) return;

        setLoading(true);
        const q = doc(ordersCollection, orderId);
        const sub = onSnapshot(q, (snap) =>
            setOrder({ id: snap.id, ...snap.data() } as Order)
        );
        setLoading(false);
        return sub;
    }, [orderId]);

    return { loading, order };
};
