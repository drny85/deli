import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { usersCollection } from '../firebase';
import { AppUser } from '../redux/auth/authSlide';
import { useAppSelector } from '../redux/store';
import { Courier } from '../types';

export const useCurrentUser = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [currentUser, setCurrentUser] = useState<typeof user>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!user) return;
        const ref = doc(usersCollection, user?.id);
        const sub = onSnapshot(ref, (snap) =>
            setCurrentUser({ id: snap.id, ...snap.data() } as Courier)
        );
        setLoading(false);
        return sub;
    }, [user]);

    return { currentUser, loading };
};
