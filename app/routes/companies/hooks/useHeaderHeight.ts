import { useRef, useEffect, useState } from 'react';

export function useHeaderHeight() {
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        if (headerRef.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    setHeaderHeight(entry.contentRect.height);
                }
            });
            resizeObserver.observe(headerRef.current);
            return () => resizeObserver.disconnect();
        }
    }, []);

    return { headerRef, headerHeight };
}