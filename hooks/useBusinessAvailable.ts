import { onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { businessCollection } from '../firebase';
import { Business } from '../redux/business/businessSlide';

export const useBusinessAvailable = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [businessAvailable, setBusinessAvailable] = useState<Business[]>([]);
    useEffect(() => {
        const q = query(
            businessCollection,
            where('profileCompleted', '==', true)
        );
        const sub = onSnapshot(q, (snapshot) => {
            setBusinessAvailable(
                snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
        });
        setIsLoading(false);

        return sub;
    }, []);

    return { isLoading, businessAvailable };
};
