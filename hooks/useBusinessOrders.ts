import { onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ordersCollection } from '../firebase';
import { Order } from '../redux/consumer/ordersSlide';
import { useAppSelector } from '../redux/store';

export const useBusinessOrders = () => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        const q = query(ordersCollection, where('businessId', '==', user.id));
        const sub = onSnapshot(q, (snap) =>
            setOrders(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
        );
        setLoading(false);
        return sub;
    }, [user]);

    return { loading, orders };
};
