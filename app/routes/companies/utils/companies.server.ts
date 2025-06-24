import type { CompaniesApiResponse, CompaniesQuery } from "../types/company.type";
import { safeParseInt } from "./company.helpers";
import { fetchCompanies } from "../api/companies.fetch";

export async function loader({ request }: { request: Request }) {
    try {
        const url = new URL(request.url);
        const params = url.searchParams;

        // Extract and validate parameters
        const page = Math.max(1, safeParseInt(params.get('page')) || 1);
        const sortBy = params.get('sortBy') || 'rank';
        const sortOrder = params.get('sortOrder') || 'asc';
        const validSortBy = ['name', 'rank', 'last_funding_amount'].includes(sortBy) ? sortBy : 'rank';
        const validSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'asc';

        const initialQuery: CompaniesQuery = {
            page,
            search: params.get('search') || undefined,
            growthStage: params.getAll('growthStage'),
            customerFocus: params.getAll('customerFocus'),
            fundingType: params.getAll('fundingType'),
            sortBy: validSortBy as 'name' | 'rank' | 'last_funding_amount',
            sortOrder: validSortOrder as 'asc' | 'desc',
            minRank: safeParseInt(params.get('minRank')),
            maxRank: safeParseInt(params.get('maxRank')),
            minFunding: safeParseInt(params.get('minFunding')),
            maxFunding: safeParseInt(params.get('maxFunding')),
        };

        const initialData = await fetchCompanies(initialQuery);
        return {
            initialData,
            initialQuery
        };
    } catch (error) {
        console.error('Error in loader:', error);
        return {
            initialData: {
                companies: [],
                pagination: {
                    page: 1,
                    limit: 10,
                    totalCount: 0,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false,
                    nextPage: null,
                    previousPage: null
                }
            },
            initialQuery: {
                page: 1,
                search: undefined,
                growthStage: [],
                customerFocus: [],
                fundingType: [],
                sortBy: 'rank',
                sortOrder: 'asc',
                minRank: undefined,
                maxRank: undefined,
                minFunding: undefined,
                maxFunding: undefined,
            },
        } satisfies {
            initialData: CompaniesApiResponse;
            initialQuery: CompaniesQuery;
        };
    }
}