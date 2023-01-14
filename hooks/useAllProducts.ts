import { getDocs, QuerySnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { productsCollection } from '../firebase';
import { Business } from '../redux/business/businessSlide';
import { Product } from '../redux/business/productsSlice';
import { useBusinessAvailable } from './useBusinessAvailable';

export const useAllProducts = () => {
    const { businessAvailable, isLoading } = useBusinessAvailable();
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const getProducts = async (business: Business[]) => {
        try {
            const ids = business.map((b) => b.id);
            const items: Product[] = [];
            ids.forEach(async (i) => {
                const productsRef = await getDocs(productsCollection(i!));
                if (productsRef.size == 0) return;
                productsRef.docs.map((d) => {
                    items.push({ id: d.id, ...d.data() });
                });
            });
            setAllProducts(items);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoading) return;
        getProducts(businessAvailable);
    }, [isLoading]);

    return { businessAvailable, allProducts, loading };
};
