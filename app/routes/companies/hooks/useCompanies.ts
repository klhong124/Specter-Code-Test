import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState, useCallback } from "react";
import type { Company } from "@companies/types/company.type";
import type { CompaniesQuery } from "@companies/types/company.type";
import { generateURLSearchParams } from "../utils/company.helpers";

interface InitialData {
    companies: Company[];
    pagination: {
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        nextPage: number | null;
        previousPage: number | null;
    };
}

export function useCompanies({ initialData, initialQuery }: { initialData: InitialData, initialQuery: CompaniesQuery }) {
    const [ ApiFetchEnabled, setApiFetchEnabled ] = useState(false);

    const [query, setQuery] = useState<CompaniesQuery>({
        page: initialQuery?.page || 1,
        search: initialQuery?.search,
        growthStage: initialQuery?.growthStage,
        customerFocus: initialQuery?.customerFocus,
        fundingType: initialQuery?.fundingType,
        sortBy: initialQuery?.sortBy,
        sortOrder: initialQuery?.sortOrder || 'asc',
        minRank: initialQuery?.minRank,
        maxRank: initialQuery?.maxRank,
        minFunding: initialQuery?.minFunding,
        maxFunding: initialQuery?.maxFunding,
    });

    // Calculate hasActiveFilters before React Query
    const hasActiveQuery = useMemo(() => {
        // check if the query has any filters values that are not undefined, empty, or 0
        const { sortBy, sortOrder, page, ...filters } = query;
        return Object.values(filters).some(value => {
            if (Array.isArray(value)) return value.length > 0;
            return value !== undefined && value !== '' && value !== 0;
        });
    }, [query]);

    // Fetch companies with infinite scroll
    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['companies', query],
        queryFn: async ({ pageParam = 1 }) => {
            // Create a clean copy of the query for this API call
            const apiQuery = { ...query };

            // Reset minFunding, minRank, maxRank, maxFunding if it's 0
            if (apiQuery.minFunding === 0) {
                delete apiQuery.minFunding;
            }
            if (apiQuery.minRank === 0) {
                delete apiQuery.minRank;
            }
            if (apiQuery.maxRank === 0) {
                delete apiQuery.maxRank;
            }
            if (apiQuery.maxFunding === 0) {
                delete apiQuery.maxFunding;
            }
            apiQuery.page = pageParam;

            const response = await fetch(`/api/companies?${generateURLSearchParams(apiQuery)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch companies');
            }
            return response.json();
        },
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined;
        },
        initialPageParam: 1,
        initialData: {
            pages: [initialData],
            pageParams: [1],
        },
        enabled: ApiFetchEnabled,
    });


    // Flatten all pages into a single array of companies
    const companies = useMemo(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap((page) => page.companies);
    }, [data]);

    // Get pagination info from the first page
    const pagination = data?.pages[0]?.pagination;
    const totalItems = pagination?.totalCount || 0;
    const loadedPages = data?.pages.length || 0;

    // Wrapper for setFilters that triggers refetch
    const setQueryWrapper = useCallback((newQuery: CompaniesQuery) => {
        setApiFetchEnabled(true);
        setQuery(newQuery);
        // The infinite query will automatically refetch when the queryKey changes
    }, []);

    const clearQuery = useCallback(() => {
        setQuery({
            page: 1,
            search: '',
            growthStage: [],
            customerFocus: [],
            fundingType: [],
            sortBy: 'rank',
            sortOrder: 'asc',
            minRank: undefined,
            maxRank: undefined,
            minFunding: undefined,
            maxFunding: undefined,
        });
        // The infinite query will automatically refetch when the queryKey changes
    }, []);

    const removeQuery = useCallback((queryKey: keyof CompaniesQuery, valueToRemove?: any) => {
        const newQuery = { ...query };
        const currentVal = newQuery[queryKey];

        if (Array.isArray(currentVal)) {
            (newQuery[queryKey] as any[]) = currentVal.filter(v => v !== valueToRemove);
        } else {
            (newQuery as any)[queryKey] = undefined;
        }

        setQuery(newQuery);
    }, [query, setQuery]);

    return {
        companies,
        isLoading,
        error,
        query,
        setQuery:setQueryWrapper,
        clearQuery,
        removeQuery,
        hasActiveQuery,
        // Infinite scroll
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        // Basic info
        totalItems,
        loadedPages,
    };
}