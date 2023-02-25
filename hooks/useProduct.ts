import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { productsCollection } from '../firebase';
import { Product } from '../redux/business/productsSlice';
import { useAppSelector } from '../redux/store';

export const useProduct = (id: string) => {
    const { business } = useAppSelector((state) => state.business);
    const [product, setProduct] = useState<Product>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!business?.id || !id) return;

        const productRef = doc(productsCollection(business.id), id);
        const sub = onSnapshot(productRef, (snap) => {
            if (!snap.exists()) return;
            setProduct({ id: snap.id, ...snap.data() });
        });
        setLoading(false);
        return sub;
    }, [id, business?.id]);

    return { product, loading };
};
