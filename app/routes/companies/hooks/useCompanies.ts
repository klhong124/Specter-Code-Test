import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchCompanies } from "../api/companies.fetch";
import type { Filters } from "../components/company.filters";

interface FilterOptions {
    growthStages: string[];
    customerFocuses: string[];
    fundingTypes: string[];
}

export function useCompanies() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['companies'],
        queryFn: fetchCompanies,
    });

    const [filters, setFilters] = useState<Filters>({
        search: '',
        growthStage: [],
        customerFocus: [],
        fundingType: [],
    });

    // Extract unique filter options
    const filterOptions: FilterOptions = useMemo(() => {
        if (!data?.companies) return { growthStages: [], customerFocuses: [], fundingTypes: [] };

        const growthStages = [...new Set(data.companies.map(c => c.growth_stage).filter(Boolean))] as string[];
        const customerFocuses = [...new Set(data.companies.map(c => c.customer_focus).filter(Boolean))] as string[];
        const fundingTypes = [...new Set(data.companies.map(c => c.last_funding_type).filter(Boolean))] as string[];

        return { growthStages, customerFocuses, fundingTypes };
    }, [data?.companies]);

    // Filter companies based on current filters
    const filteredCompanies = useMemo(() => {
        if (!data?.companies) return [];

        return data.companies.filter(company => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesSearch =
                    company.name.toLowerCase().includes(searchLower) ||
                    company.domain.toLowerCase().includes(searchLower) ||
                    company.description.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            // Growth stage filter
            if (filters.growthStage.length > 0 && company.growth_stage) {
                if (!filters.growthStage.includes(company.growth_stage)) return false;
            }

            // Customer focus filter
            if (filters.customerFocus.length > 0 && company.customer_focus) {
                if (!filters.customerFocus.includes(company.customer_focus)) return false;
            }

            // Funding type filter
            if (filters.fundingType.length > 0 && company.last_funding_type) {
                if (!filters.fundingType.includes(company.last_funding_type)) return false;
            }

            return true;
        });
    }, [data?.companies, filters]);

    const clearFilters = () => {
        setFilters({
            search: '',
            growthStage: [],
            customerFocus: [],
            fundingType: [],
        });
    };

    const hasActiveFilters = Boolean(
        filters.search ||
        filters.growthStage.length > 0 ||
        filters.customerFocus.length > 0 ||
        filters.fundingType.length > 0
    );

    return {
        companies: data?.companies || [],
        filteredCompanies,
        isLoading,
        error,
        filters,
        setFilters,
        filterOptions,
        clearFilters,
        hasActiveFilters,
    };
}