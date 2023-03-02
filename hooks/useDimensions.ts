import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

export const useDimensions = () => {
    const [isPortrait, setIsPortrait] = useState<boolean>();
    const { height, width } = useWindowDimensions();

    useEffect(() => {
        setIsPortrait(height >= width);
    }, [width, height]);

    return { isPortrait };
};
