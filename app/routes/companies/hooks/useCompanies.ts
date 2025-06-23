import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState, useCallback } from "react";
import type { Filters } from "@companies/types/companies.filters.type";
import type { Company } from "@companies/types/company.type";

interface FetchCompaniesParams {
    page?: number;
    limit?: number;
    search?: string;
    growthStage?: string[];
    customerFocus?: string[];
    fundingType?: string[];
    sortBy?: 'name' | 'rank' | 'last_funding_amount';
    sortOrder?: 'asc' | 'desc';
    minRank?: number;
    maxRank?: number;
    minFunding?: number;
    maxFunding?: number;
}

async function fetchCompanies(params: FetchCompaniesParams = {}): Promise<{
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
}> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.growthStage) {
        params.growthStage.forEach(stage => searchParams.append('growthStage', stage));
    }
    if (params.customerFocus) {
        params.customerFocus.forEach(focus => searchParams.append('customerFocus', focus));
    }
    if (params.fundingType) {
        params.fundingType.forEach(type => searchParams.append('fundingType', type));
    }
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    if (params.minRank) searchParams.set('minRank', params.minRank.toString());
    if (params.maxRank) searchParams.set('maxRank', params.maxRank.toString());
    if (params.minFunding) searchParams.set('minFunding', params.minFunding.toString());
    if (params.maxFunding) searchParams.set('maxFunding', params.maxFunding.toString());

    const response = await fetch(`/api/companies?${searchParams.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch companies');
    }
    return response.json();
}

export function useCompanies() {
    const [filters, setFilters] = useState<Filters>({
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

    const [pageSize, setPageSize] = useState(20);

    // Fetch companies with infinite scroll
    const {
        data: infiniteData,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['companies', filters, pageSize],
        queryFn: ({ pageParam = 1 }) => {
            const apiFilters: FetchCompaniesParams = {
                page: pageParam,
                limit: pageSize,
                search: filters.search || undefined,
                growthStage: filters.growthStage.length > 0 ? filters.growthStage : undefined,
                customerFocus: filters.customerFocus.length > 0 ? filters.customerFocus : undefined,
                fundingType: filters.fundingType.length > 0 ? filters.fundingType : undefined,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
                minRank: filters.minRank,
                maxRank: filters.maxRank,
                minFunding: filters.minFunding,
                maxFunding: filters.maxFunding,
            };

            if (apiFilters.minFunding === 0) {
                delete apiFilters.minFunding;
            }

            return fetchCompanies(apiFilters);
        },
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined;
        },
        initialPageParam: 1,
    });

    // Flatten all pages into a single array of companies
    const companies = useMemo(() => {
        if (!infiniteData?.pages) return [];
        return infiniteData.pages.flatMap((page) => page.companies);
    }, [infiniteData]);

    // Get pagination info from the first page
    const pagination = infiniteData?.pages[0]?.pagination;
    const totalItems = pagination?.totalCount || 0;
    const loadedPages = infiniteData?.pages.length || 0;

    // Wrapper for setFilters that triggers refetch
    const setFiltersState = useCallback((newFilters: Filters) => {
        setFilters(newFilters);
        // The infinite query will automatically refetch when the queryKey changes
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
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

    const removeFilter = useCallback((filterKey: keyof Filters, valueToRemove?: any) => {
        const newFilters = { ...filters };
        const currentVal = newFilters[filterKey];

        if (Array.isArray(currentVal)) {
            (newFilters[filterKey] as any[]) = currentVal.filter(v => v !== valueToRemove);
        } else {
            (newFilters as any)[filterKey] = undefined;
        }

        setFiltersState(newFilters);
    }, [filters, setFiltersState]);

    const hasActiveFilters = useMemo(() => {
        const activeFilters = { ...filters };
        if (activeFilters.minFunding === 0) {
            delete activeFilters.minFunding;
        }

        return Object.values(activeFilters).some(value => {
            if (Array.isArray(value)) return value.length > 0;
            return value !== undefined && value !== '' && value !== 'rank' && value !== 'asc';
        });
    }, [filters]);

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        // The infinite query will automatically refetch when the queryKey changes
    };

    return {
        companies,
        isLoading,
        error,
        filters,
        setFilters,
        clearFilters,
        removeFilter,
        hasActiveFilters,
        // Infinite scroll
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        // Basic info
        totalItems,
        loadedPages,
        handlePageSizeChange,
    };
}