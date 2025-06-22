import { useState, useEffect } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';

export function useAutoHidingHeader() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);

    useMotionValueEvent(scrollY, 'change', (latest) => {
        const previous = scrollY.getPrevious();

        if (latest > (previous ?? 0) && latest > 150) {
            setHidden(true); // Scrolling down
        } else {
            setHidden(false); // Scrolling up
        }
    });

    return { isHidden: hidden };
}