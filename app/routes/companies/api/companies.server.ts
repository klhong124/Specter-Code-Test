import { prisma } from "@/utils/prisma.server";
import type { CompaniesQuery, CompaniesApiResponse } from "@companies/types/company.type";
import { NUMBER_PRT_FETCH } from "@companies/utils/company.constant";

const buildWhereClause = (query: CompaniesQuery) => {
    const where: any = {};
    if (query.search) {
        where.OR = [
            { name: { contains: query.search, mode: 'insensitive' } },
            { domain: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
        ];
    }
    if (query.growthStage && query.growthStage.length > 0) {
        where.growth_stage = { in: query.growthStage };
    }
    if (query.customerFocus && query.customerFocus.length > 0) {
        where.customer_focus = { in: query.customerFocus };
    }
    if (query.fundingType && query.fundingType.length > 0) {
        where.last_funding_type = { in: query.fundingType };
    }
    if (query.minRank !== undefined) {
        where.rank = { ...where.rank, gte: query.minRank };
    }
    if (query.maxRank !== undefined) {
        where.rank = { ...where.rank, lte: query.maxRank };
    }
    if (query.minFunding !== undefined) {
        where.last_funding_amount = { ...where.last_funding_amount, gte: query.minFunding };
    }
    if (query.maxFunding !== undefined) {
        where.last_funding_amount = { ...where.last_funding_amount, lte: query.maxFunding };
    }
    return where;
};

const buildOrderByClause = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    const orderBy: any = {};
    switch (sortBy) {
        case 'name':
            orderBy.name = sortOrder;
            break;
        case 'last_funding_amount':
            orderBy.last_funding_amount = sortOrder;
            break;
        case 'rank':
        default:
            orderBy.rank = sortOrder;
            break;
    }
    return orderBy;
};

export async function fetchCompanies(query: CompaniesQuery): Promise<CompaniesApiResponse> {
    try {
        // Extract and validate parameters
        const page = Math.max(1, query.page || 1);
        const limit = NUMBER_PRT_FETCH;
        const skip = (page - 1) * limit;

        const sortBy = query.sortBy || 'rank';
        const sortOrder = query.sortOrder || 'asc';
        const validSortBy = ['name', 'rank', 'last_funding_amount'].includes(sortBy) ? sortBy : 'rank';
        const validSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'asc';

        // Build Prisma clauses
        const where = buildWhereClause(query);
        const orderBy = buildOrderByClause(validSortBy, validSortOrder as 'asc' | 'desc');

        // Fetch data concurrently
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

        // Serialize and prepare response
        const serializedCompanies = companies.map(c => ({
            ...c,
            last_funding_amount: c.last_funding_amount?.toString() ?? null
        }));
        const totalPages = Math.ceil(totalCount / limit);

        return {
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
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw new Error('Failed to fetch companies');
    }
}