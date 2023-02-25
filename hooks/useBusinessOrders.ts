import { onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ordersCollection } from '../firebase';
import { Order, setAllOrders } from '../redux/consumer/ordersSlide';
import { useAppDispatch, useAppSelector } from '../redux/store';

export const useBusinessOrders = () => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        const q = query(ordersCollection, where('businessId', '==', user.id));
        const sub = onSnapshot(q, (snap) => {
            setOrders(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            dispatch(
                setAllOrders(
                    snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                )
            );
        });
        setLoading(false);
        return sub;
    }, [user]);

    return { loading, orders };
};
