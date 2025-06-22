import { prisma } from "../../../utils/prisma.server";
import type { Company } from "../types/company.type";

export async function loader({ request }: { request: Request }): Promise<Response> {
    try {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const search = url.searchParams.get('search') || '';
        const growthStage = url.searchParams.getAll('growthStage');
        const customerFocus = url.searchParams.getAll('customerFocus');
        const fundingType = url.searchParams.getAll('fundingType');
        const sortBy = url.searchParams.get('sortBy') || 'rank';
        const sortOrder = url.searchParams.get('sortOrder') || 'asc';

        // Validate pagination parameters
        const validPage = Math.max(1, page);
        const validLimit = Math.min(Math.max(1, limit), 100); // Cap at 100 items per page
        const skip = (validPage - 1) * validLimit;

        // Validate sorting parameters
        const validSortBy = ['name', 'rank'].includes(sortBy) ? sortBy : 'rank';
        const validSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'asc';

        // Build where clause for filtering
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { domain: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (growthStage.length > 0) {
            where.growth_stage = { in: growthStage };
        }

        if (customerFocus.length > 0) {
            where.customer_focus = { in: customerFocus };
        }

        if (fundingType.length > 0) {
            where.last_funding_type = { in: fundingType };
        }

        // Build orderBy clause for sorting
        const orderBy: any = {};
        if (validSortBy === 'name') {
            orderBy.name = validSortOrder;
        } else {
            orderBy.rank = validSortOrder;
        }

        // Get total count for pagination metadata
        const totalCount = await prisma.company.count({ where });

        // Fetch paginated and filtered companies
        const companies = await prisma.company.findMany({
            where,
            orderBy,
            select: {
                id: true,
                name: true,
                domain: true,
                rank: true,
                description: true,
                growth_stage: true,
                last_funding_type: true,
                last_funding_amount: true,
                customer_focus: true,
                createdAt: true
            },
            skip,
            take: validLimit
        });

        // Convert BigInt values to strings for JSON serialization
        const serializedCompanies = companies.map(company => ({
            ...company,
            last_funding_amount: company.last_funding_amount ? company.last_funding_amount.toString() : null
        }));

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / validLimit);
        const hasNextPage = validPage < totalPages;
        const hasPreviousPage = validPage > 1;

        const response = {
            companies: serializedCompanies,
            pagination: {
                page: validPage,
                limit: validLimit,
                totalCount,
                totalPages,
                hasNextPage,
                hasPreviousPage,
                nextPage: hasNextPage ? validPage + 1 : null,
                previousPage: hasPreviousPage ? validPage - 1 : null
            }
        };

        return new Response(JSON.stringify(response), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching companies:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch companies' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}