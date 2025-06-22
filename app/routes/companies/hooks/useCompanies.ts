import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo, useState, useCallback } from "react";
import type { Filters } from "../components/company.filters";
import type { Company } from "../types/company.type";

interface FilterOptions {
    growthStages: string[];
    customerFocuses: string[];
    fundingTypes: string[];
}

interface FetchCompaniesParams {
    page?: number;
    limit?: number;
    search?: string;
    growthStage?: string[];
    customerFocus?: string[];
    fundingType?: string[];
}

interface CompanyWithPage extends Company {
    _pageNumber: number;
    _pageIndex: number; // Index within the page (0-19 for page size 20)
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

    const response = await fetch(`/api/companies?${searchParams.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch companies');
    }
    return response.json();
}

async function fetchFilterOptions(): Promise<FilterOptions> {
    // For now, we'll extract filter options from the first page of companies
    // This is a simple approach that avoids creating a separate API endpoint
    const response = await fetch('/api/companies?limit=1000');
    if (!response.ok) {
        throw new Error('Failed to fetch filter options');
    }
    const data = await response.json();

    const companies = data.companies || [];
    const growthStages = [...new Set(companies.map((c: Company) => c.growth_stage).filter(Boolean))] as string[];
    const customerFocuses = [...new Set(companies.map((c: Company) => c.customer_focus).filter(Boolean))] as string[];
    const fundingTypes = [...new Set(companies.map((c: Company) => c.last_funding_type).filter(Boolean))] as string[];

    return {
        growthStages: growthStages.sort(),
        customerFocuses: customerFocuses.sort(),
        fundingTypes: fundingTypes.sort()
    };
}

export function useCompanies() {
    const [filters, setFiltersState] = useState<Filters>({
        search: '',
        growthStage: [],
        customerFocus: [],
        fundingType: [],
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
        refetch
    } = useInfiniteQuery({
        queryKey: ['companies', filters, pageSize],
        queryFn: ({ pageParam = 1 }) => fetchCompanies({
            page: pageParam,
            limit: pageSize,
            search: filters.search || undefined,
            growthStage: filters.growthStage.length > 0 ? filters.growthStage : undefined,
            customerFocus: filters.customerFocus.length > 0 ? filters.customerFocus : undefined,
            fundingType: filters.fundingType.length > 0 ? filters.fundingType : undefined,
        }),
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined;
        },
        initialPageParam: 1,
    });

    // Fetch filter options
    const { data: filterOptionsData } = useQuery({
        queryKey: ['filterOptions'],
        queryFn: fetchFilterOptions,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    // Extract filter options
    const filterOptions: FilterOptions = useMemo(() => {
        return {
            growthStages: filterOptionsData?.growthStages || [],
            customerFocuses: filterOptionsData?.customerFocuses || [],
            fundingTypes: filterOptionsData?.fundingTypes || [],
        };
    }, [filterOptionsData]);

    // Flatten all pages into a single array of companies with page tracking
    const companies = useMemo(() => {
        if (!infiniteData?.pages) return [];
        return infiniteData.pages.flatMap((page, pageIndex) =>
            page.companies.map((company, companyIndex) => ({
                ...company,
                _pageNumber: pageIndex + 1,
                _pageIndex: companyIndex // Index within the page (0-19 for page size 20)
            }))
        );
    }, [infiniteData]);

    // Get pagination info from the first page
    const pagination = infiniteData?.pages[0]?.pagination;
    const totalPages = pagination?.totalPages || 0;
    const totalItems = pagination?.totalCount || 0;
    const loadedPages = infiniteData?.pages.length || 0;

    // Wrapper for setFilters that triggers refetch
    const setFilters = useCallback((newFilters: Filters) => {
        setFiltersState(newFilters);
        // The infinite query will automatically refetch when the queryKey changes
    }, []);

    const clearFilters = useCallback(() => {
        setFiltersState({
            search: '',
            growthStage: [],
            customerFocus: [],
            fundingType: [],
        });
        // The infinite query will automatically refetch when the queryKey changes
    }, []);

    const hasActiveFilters = Boolean(
        filters.search ||
        filters.growthStage.length > 0 ||
        filters.customerFocus.length > 0 ||
        filters.fundingType.length > 0
    );

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
        filterOptions,
        clearFilters,
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