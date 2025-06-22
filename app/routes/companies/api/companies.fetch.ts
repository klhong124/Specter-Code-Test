import { prisma } from "@/utils/prisma.server";
import type { CompanyQueryFilters } from "@companies/types/companies.filters.type";
import { safeParseInt } from "@companies/utils/company.helpers";

const buildWhereClause = (filters: CompanyQueryFilters) => {
    const where: any = {};
    if (filters.search) {
        where.OR = [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { domain: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
        ];
    }
    if (filters.growthStage && filters.growthStage.length > 0) {
        where.growth_stage = { in: filters.growthStage };
    }
    if (filters.customerFocus && filters.customerFocus.length > 0) {
        where.customer_focus = { in: filters.customerFocus };
    }
    if (filters.fundingType && filters.fundingType.length > 0) {
        where.last_funding_type = { in: filters.fundingType };
    }
    if (filters.minRank !== undefined) {
        where.rank = { ...where.rank, gte: filters.minRank };
    }
    if (filters.maxRank !== undefined) {
        where.rank = { ...where.rank, lte: filters.maxRank };
    }
    if (filters.minFunding !== undefined) {
        where.last_funding_amount = { ...where.last_funding_amount, gte: filters.minFunding };
    }
    if (filters.maxFunding !== undefined) {
        where.last_funding_amount = { ...where.last_funding_amount, lte: filters.maxFunding };
    }
    return where;
};

const buildOrderByClause = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    const orderBy: any = {};
    switch (sortBy) {
        case 'name':
            orderBy.name = sortOrder;
            break;
        case 'rank':
        default:
            orderBy.rank = sortOrder;
            break;
    }
    return orderBy;
};

export async function loader({ request }: { request: Request }): Promise<Response> {
    try {
        const url = new URL(request.url);
        const params = url.searchParams;

        // 1. Extract and Validate Parameters
        const page = Math.max(1, safeParseInt(params.get('page')) || 1);
        const limit = Math.min(Math.max(1, safeParseInt(params.get('limit')) || 20), 100);
        const skip = (page - 1) * limit;

        const sortBy = params.get('sortBy') || 'rank';
        const sortOrder = params.get('sortOrder') || 'asc';
        const validSortBy = ['name', 'rank'].includes(sortBy) ? sortBy : 'rank';
        const validSortOrder = ['asc', 'desc'].includes(sortOrder) ? (sortOrder as 'asc' | 'desc') : 'asc';

        const filters: CompanyQueryFilters = {
            search: params.get('search') || undefined,
            growthStage: params.getAll('growthStage'),
            customerFocus: params.getAll('customerFocus'),
            fundingType: params.getAll('fundingType'),
            minRank: safeParseInt(params.get('minRank')),
            maxRank: safeParseInt(params.get('maxRank')),
            minFunding: safeParseInt(params.get('minFunding')),
            maxFunding: safeParseInt(params.get('maxFunding')),
        };

        // 2. Build Prisma Clauses
        const where = buildWhereClause(filters);
        const orderBy = buildOrderByClause(validSortBy, validSortOrder);

        // 3. Fetch Data Concurrently
        const [totalCount, companies] = await prisma.$transaction([
            prisma.company.count({ where }),
            prisma.company.findMany({
                where,
                orderBy,
                select: {
                    id: true, name: true, domain: true, rank: true, description: true,
                    growth_stage: true, last_funding_type: true, last_funding_amount: true,
                    customer_focus: true, createdAt: true,
                },
                skip,
                take: limit,
            }),
        ]);

        // 4. Serialize and Prepare Response
        const serializedCompanies = companies.map(c => ({ ...c, last_funding_amount: c.last_funding_amount?.toString() ?? null }));
        const totalPages = Math.ceil(totalCount / limit);

        const response = {
            companies: serializedCompanies,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
                nextPage: page < totalPages ? page + 1 : null,
                previousPage: page > 1 ? page - 1 : null,
            },
        };

        return new Response(JSON.stringify(response), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error fetching companies:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch companies' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}