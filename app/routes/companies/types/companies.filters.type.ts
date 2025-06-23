export interface Filters {
    search: string;
    growthStage: string[];
    customerFocus: string[];
    fundingType: string[];
    sortBy: 'name' | 'rank' | 'last_funding_amount';
    sortOrder: 'asc' | 'desc';
    minRank?: number;
    maxRank?: number;
    minFunding?: number;
    maxFunding?: number;
}

export type CompanyQueryFilters = Omit<Partial<Filters>, "sortBy" | "sortOrder">;