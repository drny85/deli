import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { productsCollection } from '../firebase';
import { Product } from '../redux/business/productsSlice';
import { useAppSelector } from '../redux/store';

export const useProducts = () => {
    const { business } = useAppSelector((state) => state.business);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!business?.id) return;

        const sub = onSnapshot(productsCollection(business.id), (snap) => {
            if (snap.empty) return;
            setProducts(
                snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
        });
        return sub;
    }, [business]);
    setLoading(false);

    return { products, loading };
};
