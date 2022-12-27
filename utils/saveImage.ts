import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { storage } from '../firebase';
import { setProductImage } from '../redux/business/productsSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';

interface SaveImageResponse {
    sucesss: boolean;
    path: string | null;
}
export const useSaveImage = () => {
    const { productImage: image } = useAppSelector((state) => state.products);
    const { business } = useAppSelector((state) => state.business);
    const [sucesss, setSucesss] = useState(false);
    const [path, setPath] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!image?.startsWith('file://')) return;
        (async () => {
            try {
                if (!image || !business) return { sucesss: false, path: null };
                const id = image.split('ImagePicker')[1].split('.')[0];
                const ext = image.split('.').pop();
                const filename = id + '.' + ext;
                const response = await fetch(image);
                const blob = await response.blob();

                const uploadRef = ref(
                    storage,
                    `${business.id}-${business.name}/${filename}`
                );
                const uploadTask = uploadBytesResumable(uploadRef, blob);
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {},
                    (error) => {
                        console.log('@Error: ', error);
                    },
                    async () => {
                        const imageUrl = await getDownloadURL(
                            uploadTask.snapshot.ref
                        );
                        const p = (await uploadTask).ref.fullPath;
                        dispatch(setProductImage(imageUrl));
                        setSucesss(true);
                        setPath(p);
                    }
                );
            } catch (error) {
                return { sucesss: false, path: null };
            }
        })();
    }, [image, business]);

    return { sucesss, path };
};
