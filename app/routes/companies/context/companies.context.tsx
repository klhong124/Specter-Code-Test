import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useCompanies } from "../hooks/useCompanies";
import type { Filters } from "../types/companies.filters.type";

interface CompaniesContextType {
    // Data
    companies: any[];
    isLoading: boolean;
    error: any;

    // Filters
    filters: Filters;
    setFilters: (filters: Filters) => void;
    filterOptions: {
        growthStages: string[];
        customerFocuses: string[];
        fundingTypes: string[];
    };
    clearFilters: () => void;
    removeFilter: (filterKey: keyof Filters, valueToRemove?: any) => void;
    hasActiveFilters: boolean;

    // Infinite scroll
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;

    // Basic info
    totalItems: number;
    loadedPages: number;
    handlePageSizeChange: (pageSize: number) => void;
}

const CompaniesContext = createContext<CompaniesContextType | undefined>(undefined);

interface CompaniesProviderProps {
    children: ReactNode;
}

export function CompaniesProvider({ children }: CompaniesProviderProps) {
    const companiesData = useCompanies();

    return (
        <CompaniesContext.Provider value={companiesData}>
            {children}
        </CompaniesContext.Provider>
    );
}

export function useCompaniesContext() {
    const context = useContext(CompaniesContext);
    if (context === undefined) {
        throw new Error('useCompaniesContext must be used within a CompaniesProvider');
    }
    return context;
}