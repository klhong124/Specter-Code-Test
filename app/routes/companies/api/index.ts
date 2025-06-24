import type { CompaniesQuery } from "@companies/types/company.type";
import { safeParseInt } from "@companies/utils/company.helpers";
import { fetchCompanies } from "./companies.server";

export async function loader({ request }: { request: Request }): Promise<Response> {
    try {
        const url = new URL(request.url);
        const params = url.searchParams;

        // Extract and validate parameters
        const page = Math.max(1, safeParseInt(params.get('page')) || 1);
        const sortBy = params.get('sortBy') || 'rank';
        const sortOrder = params.get('sortOrder') || 'asc';
        const validSortBy = ['name', 'rank', 'last_funding_amount'].includes(sortBy) ? sortBy : 'rank';
        const validSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'asc';

        const query: CompaniesQuery = {
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

        const response = await fetchCompanies(query);

        return new Response(JSON.stringify(response), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error in loader:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch companies' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}