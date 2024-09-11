import { useEffect, useState } from 'react';

type ScreenType = {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
};

const useScreen = (): ScreenType => {
    const [width, setWidth] = useState<number>(
        typeof window !== 'undefined' ? window.innerWidth : 0,
    );

    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [isDesktop, setIsDesktop] = useState<boolean>(false);

    useEffect(() => {
        const updateScreenSize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', updateScreenSize);

        return () => window.removeEventListener('resize', updateScreenSize);
    }, []);

    useEffect(() => {
        if (width > 1280) {
            setIsDesktop(true);
            setIsTablet(false);
            setIsMobile(false);
        } else if (width >= 768 && width <= 1280) {
            setIsDesktop(false);
            setIsTablet(true);
            setIsMobile(false);
        } else {
            setIsDesktop(false);
            setIsTablet(false);
            setIsMobile(true);
        }
    }, [width]);

    return { isDesktop, isTablet, isMobile };
};

export default useScreen;
