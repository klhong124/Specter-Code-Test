import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useCompanies } from "@companies/hooks/useCompanies";
import type { CompaniesApiResponse, CompaniesQuery } from "@companies/types/company.type";


interface CompaniesContextType {
    // Data
    companies: any[];
    isLoading: boolean;
    error: any;

    // Query
    query: CompaniesQuery;
    setQuery: (query: CompaniesQuery) => void;
    clearQuery: () => void;
    removeQuery: (queryKey: keyof CompaniesQuery, valueToRemove?: any) => void;
    hasActiveQuery: boolean;

    // Infinite scroll
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;

    // Basic info
    totalItems: number;
    loadedPages: number;
}

const CompaniesContext = createContext<CompaniesContextType | undefined>(undefined);

interface CompaniesProviderProps {
    children: ReactNode;
    initialData: CompaniesApiResponse;
    initialQuery: CompaniesQuery;
}

export function CompaniesProvider({ children, initialData, initialQuery }: CompaniesProviderProps) {
    const companiesData = useCompanies({ initialData, initialQuery });

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