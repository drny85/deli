import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { businessCollection } from '../firebase';
import { Business } from '../redux/business/businessSlide';

export const useBusiness = (businessId: string) => {
    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!businessId) return;
       
        const businessRef = doc(businessCollection, businessId);
        const sub = onSnapshot(businessRef, (snap) => {
            if (!snap.exists()) return;
            setBusiness({ id: snap.id, ...snap.data() });
        });
        setLoading(false);
        return sub;
    }, [businessId]);

    return { business, loading };
};
