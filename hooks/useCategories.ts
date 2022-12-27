import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { categoriessCollection } from '../firebase';

import { Category } from '../redux/business/categoriesSlice';
import { useAppSelector } from '../redux/store';

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const { business } = useAppSelector((state) => state.business);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!business) return;
        const sub = onSnapshot(categoriessCollection(business.id!), (snap) => {
            setCategories(
                snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
            setLoading(false);
        });
        return sub;
    }, [business]);

    return { categories, loading };
};
