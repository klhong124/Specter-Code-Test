import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router";
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
    const [searchParams, setSearchParams] = useSearchParams();

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

    // Update URL when query changes
    useEffect(() => {
        const newSearchParams = new URLSearchParams();

        // Add non-empty values to URL params
        if (query.search) newSearchParams.set('search', query.search);
        if (query.growthStage?.length) {
            query.growthStage.forEach(stage => newSearchParams.append('growthStage', stage));
        }
        if (query.customerFocus?.length) {
            query.customerFocus.forEach(focus => newSearchParams.append('customerFocus', focus));
        }
        if (query.fundingType?.length) {
            query.fundingType.forEach(type => newSearchParams.append('fundingType', type));
        }
        if (query.sortBy && query.sortBy !== 'rank') newSearchParams.set('sortBy', query.sortBy);
        if (query.sortOrder && query.sortOrder !== 'asc') newSearchParams.set('sortOrder', query.sortOrder);
        if (query.minRank && query.minRank > 0) newSearchParams.set('minRank', query.minRank.toString());
        if (query.maxRank && query.maxRank > 0) newSearchParams.set('maxRank', query.maxRank.toString());
        if (query.minFunding && query.minFunding > 0) newSearchParams.set('minFunding', query.minFunding.toString());
        if (query.maxFunding && query.maxFunding > 0) newSearchParams.set('maxFunding', query.maxFunding.toString());
        if (query.page && query.page > 1) newSearchParams.set('page', query.page.toString());

        // Update URL without triggering navigation
        setSearchParams(newSearchParams, { replace: true });
    }, [query, setSearchParams]);

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
        const clearedQuery: CompaniesQuery = {
            page: 1,
            search: '',
            growthStage: [],
            customerFocus: [],
            fundingType: [],
            sortBy: 'rank' as const,
            sortOrder: 'asc' as const,
            minRank: undefined,
            maxRank: undefined,
            minFunding: undefined,
            maxFunding: undefined,
        };
        setQuery(clearedQuery);

        // Clear URL search parameters
        setSearchParams(new URLSearchParams(), { replace: true });
    }, [setSearchParams]);

    const removeQuery = useCallback((queryKey: keyof CompaniesQuery, valueToRemove?: any) => {
        const newQuery = { ...query };
        const currentVal = newQuery[queryKey];

        if (Array.isArray(currentVal)) {
            (newQuery[queryKey] as any[]) = currentVal.filter(v => v !== valueToRemove);
        } else {
            (newQuery as any)[queryKey] = undefined;
        }

        setQuery(newQuery);
        // URL will be updated automatically by the useEffect
    }, [query]);

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