import { prisma } from "../../../utils/prisma.server";
import type { Company } from "../types/company.type";

export async function loader({ request }: { request: Request }): Promise<Response> {
    try {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');

        // Validate pagination parameters
        const validPage = Math.max(1, page);
        const validLimit = Math.min(Math.max(1, limit), 100); // Cap at 100 items per page
        const skip = (validPage - 1) * validLimit;

        // Get total count for pagination metadata
        const totalCount = await prisma.company.count();

        // Fetch paginated companies
        const companies = await prisma.company.findMany({
            orderBy: {
                rank: 'asc'
            },
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

export async function fetchCompanies(): Promise<{ companies: Company[] }> {
    const response = await fetch('/api/companies');
    if (!response.ok) {
        throw new Error('Failed to fetch companies');
    }
    return response.json();
}