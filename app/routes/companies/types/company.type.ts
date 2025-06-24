export interface Company {
    id: string;
    name: string;
    domain: string;
    rank: number;
    description: string;
    growth_stage: string | null;
    last_funding_type: string | null;
    last_funding_amount: string | null;
    customer_focus: string | null;
    createdAt: Date | null;
}
export interface CompanyPagination {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
}

export interface CompaniesApiResponse {
    companies: Company[];
    pagination: CompanyPagination;
}

export interface CompaniesFilters {
    search?: string;
    growthStage: string[];
    customerFocus: string[];
    fundingType: string[];
    minRank?: number;
    maxRank?: number;
    minFunding?: number;
    maxFunding?: number;
}

export interface CompaniesSorting {
    sortBy: 'name' | 'rank' | 'last_funding_amount';
    sortOrder: 'asc' | 'desc';
}

export interface CompaniesQuery extends CompaniesFilters, CompaniesSorting {
    page: number;
}