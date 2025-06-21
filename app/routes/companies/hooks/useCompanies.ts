import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
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
    const [filters, setFilters] = useState<Filters>({
        search: '',
        growthStage: [],
        customerFocus: [],
        fundingType: [],
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    // Fetch companies with server-side pagination and filtering
    const { data, isLoading, error } = useQuery({
        queryKey: ['companies', filters, currentPage, pageSize],
        queryFn: () => fetchCompanies({
            page: currentPage,
            limit: pageSize,
            search: filters.search || undefined,
            growthStage: filters.growthStage.length > 0 ? filters.growthStage : undefined,
            customerFocus: filters.customerFocus.length > 0 ? filters.customerFocus : undefined,
            fundingType: filters.fundingType.length > 0 ? filters.fundingType : undefined,
        }),
        placeholderData: (previousData) => previousData, // Keep previous data while loading new data
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

    // Extract pagination info from API response
    const pagination = data?.pagination;
    const companies = data?.companies || [];
    const totalPages = pagination?.totalPages || 0;
    const totalItems = pagination?.totalCount || 0;

    const clearFilters = () => {
        setFilters({
            search: '',
            growthStage: [],
            customerFocus: [],
            fundingType: [],
        });
        // Reset to first page when clearing filters
        setCurrentPage(1);
    };

    const hasActiveFilters = Boolean(
        filters.search ||
        filters.growthStage.length > 0 ||
        filters.customerFocus.length > 0 ||
        filters.fundingType.length > 0
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        // Reset to first page when changing page size
        setCurrentPage(1);
    };

    return {
        companies,
        filteredCompanies: companies, // For backward compatibility
        paginatedCompanies: companies, // For backward compatibility
        isLoading,
        error,
        filters,
        setFilters,
        filterOptions,
        clearFilters,
        hasActiveFilters,
        // Pagination
        currentPage,
        totalPages,
        pageSize,
        totalItems,
        handlePageChange,
        handlePageSizeChange,
    };
}