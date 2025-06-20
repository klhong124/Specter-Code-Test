import { prisma } from "../../utils/prisma.server";

export async function loader(): Promise<Response> {
    try {
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
            }
        });

        // Convert BigInt values to strings for JSON serialization
        const serializedCompanies = companies.map(company => ({
            ...company,
            last_funding_amount: company.last_funding_amount ? company.last_funding_amount.toString() : null
        }));

        return new Response(JSON.stringify({ companies: serializedCompanies }), {
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