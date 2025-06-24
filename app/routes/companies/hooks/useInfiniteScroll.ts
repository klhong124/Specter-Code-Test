import { useRef, useCallback, useEffect } from 'react';

interface UseInfiniteScrollProps {
    isLoading: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
}

export function useInfiniteScroll({
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
}: UseInfiniteScrollProps) {
    const observerRef = useRef<IntersectionObserver | null>(null);

    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading) return;

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }, { rootMargin: '200px' });

        if (node) observerRef.current.observe(node);
    }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Cleanup observer on unmount
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return { lastElementRef };
}