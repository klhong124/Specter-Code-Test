export interface Filters {
    search: string;
    growthStage: string[];
    customerFocus: string[];
    fundingType: string[];
    sortBy: 'name' | 'rank';
    sortOrder: 'asc' | 'desc';
    minRank?: number;
    maxRank?: number;
    minFunding?: number;
    maxFunding?: number;
}