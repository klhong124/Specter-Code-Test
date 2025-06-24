import type { CompaniesApiResponse, CompaniesQuery, Company } from "../types/company.type";

// Helper function to get funding insights
function getFundingInsights(companies: Company[]): string | null {
    if (!companies.length) return null;

    const companiesWithFunding = companies.filter(c => c.last_funding_amount);
    if (companiesWithFunding.length === 0) return null;

    const fundingAmounts = companiesWithFunding.map(c => {
        const amount = c.last_funding_amount;
        return amount ? parseInt(amount) : 0;
    }).filter(amount => amount > 0);

    if (fundingAmounts.length === 0) return null;

    const avgFunding = fundingAmounts.reduce((sum, amount) => sum + amount, 0) / fundingAmounts.length;
    const maxFunding = Math.max(...fundingAmounts);

    return `Average funding: $${(avgFunding / 1000000).toFixed(1)}M, with top funding reaching $${(maxFunding / 1000000).toFixed(1)}M.`;
}

// Helper function to get industry insights
function getIndustryInsights(companies: Company[]): string | null {
    if (!companies.length) return null;

    const growthStages = companies.filter(c => c.growth_stage).map(c => c.growth_stage!);
    const customerFocuses = companies.filter(c => c.customer_focus).map(c => c.customer_focus!);

    const insights = [];

    if (growthStages.length > 0) {
        const stageCounts = growthStages.reduce((acc, stage) => {
            acc[stage] = (acc[stage] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topStage = Object.entries(stageCounts)
            .sort(([,a], [,b]) => b - a)[0];

        if (topStage) {
            insights.push(`${topStage[1]} ${topStage[0]} companies`);
        }
    }

    if (customerFocuses.length > 0) {
        const focusCounts = customerFocuses.reduce((acc, focus) => {
            acc[focus] = (acc[focus] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topFocus = Object.entries(focusCounts)
            .sort(([,a], [,b]) => b - a)[0];

        if (topFocus) {
            insights.push(`${topFocus[1]} ${topFocus[0]} focused companies`);
        }
    }

    return insights.length > 0 ? `Includes ${insights.join(' and ')}.` : null;
}

export function generateCompaniesMeta({
    data,
    location
}: {
    data: {
        initialData: CompaniesApiResponse;
        initialQuery: CompaniesQuery;
    };
    location: { pathname: string; search: string; }
}) {
    const { initialData, initialQuery } = data || {};

    // Create a proper URL by using the current origin
    const url = new URL(location.pathname + location.search, 'http://localhost');

    // Build dynamic title based on filters and data
    let title = "Companies";
    const searchTerm = url.searchParams.get('search');
    const growthStage = url.searchParams.get('growthStage');
    const customerFocus = url.searchParams.get('customerFocus');
    const fundingType = url.searchParams.get('fundingType');
    const minRank = url.searchParams.get('minRank');
    const maxRank = url.searchParams.get('maxRank');
    const minFunding = url.searchParams.get('minFunding');
    const maxFunding = url.searchParams.get('maxFunding');

    // Build rich description using SSR data
    let description = "Discover and explore innovative companies across various industries and growth stages.";

    if (searchTerm) {
        const companyExamples = initialData?.companies.slice(0, 3).map(c => c.name).join(', ');
        description = `Find ${initialData?.pagination.totalCount || ''} companies matching "${searchTerm}". ${companyExamples ? `Featured companies include ${companyExamples}. ` : ''}Browse through detailed company information, funding history, and growth metrics.`;
    } else if (initialData?.pagination.totalCount) {
        const filters = [];

        if (growthStage) filters.push(`growth stage: ${growthStage}`);
        if (customerFocus) filters.push(`customer focus: ${customerFocus}`);
        if (fundingType) filters.push(`funding type: ${fundingType}`);
        if (minRank || maxRank) {
            const rankFilter = [];
            if (minRank) rankFilter.push(`rank ≥ ${minRank}`);
            if (maxRank) rankFilter.push(`rank ≤ ${maxRank}`);
            filters.push(`rank: ${rankFilter.join(' and ')}`);
        }
        if (minFunding || maxFunding) {
            const fundingFilter = [];
            if (minFunding) fundingFilter.push(`funding ≥ $${parseInt(minFunding).toLocaleString()}`);
            if (maxFunding) fundingFilter.push(`funding ≤ $${parseInt(maxFunding).toLocaleString()}`);
            filters.push(`funding: ${fundingFilter.join(' and ')}`);
        }

        // Get company examples and insights
        const companyExamples = initialData.companies.slice(0, 3).map(c => c.name);
        const fundingInsights = getFundingInsights(initialData.companies);
        const industryInsights = getIndustryInsights(initialData.companies);

        if (filters.length > 0) {
            description = `Browse ${initialData.pagination.totalCount} companies filtered by ${filters.join(', ')}.`;
            if (companyExamples.length > 0) {
                description += ` Featured companies include ${companyExamples.join(', ')}.`;
            }
            if (fundingInsights) {
                description += ` ${fundingInsights}`;
            }
            if (industryInsights) {
                description += ` ${industryInsights}`;
            }
            description += ` Explore detailed company profiles, funding history, and growth metrics.`;
        } else {
            description = `Browse ${initialData.pagination.totalCount} companies.`;
            if (companyExamples.length > 0) {
                description += ` Featured companies include ${companyExamples.join(', ')}.`;
            }
            if (fundingInsights) {
                description += ` ${fundingInsights}`;
            }
            if (industryInsights) {
                description += ` ${industryInsights}`;
            }
            description += ` Filter by growth stage, customer focus, funding type, rank, and funding amount.`;
        }
    }

    // Add sorting information
    const sortBy = initialQuery?.sortBy || 'rank';
    const sortOrder = initialQuery?.sortOrder || 'asc';
    if (sortBy !== 'rank' || sortOrder !== 'asc') {
        const sortText = `Sorted by ${sortBy.replace('_', ' ')} ${sortOrder === 'desc' ? 'descending' : 'ascending'}`;
        description += ` ${sortText}.`;
    }

    // Build keywords for SEO
    const keywords = ['companies', 'startups', 'business directory'];
    if (searchTerm) keywords.push(searchTerm);
    if (growthStage) keywords.push(growthStage);
    if (customerFocus) keywords.push(customerFocus);
    if (fundingType) keywords.push(fundingType);
    if (initialData?.companies.length) {
        keywords.push(...initialData.companies.slice(0, 3).map(c => c.name));
    }

    return [
        { title: "Companies result | Specter" },
        { name: "description", content: description },
        { name: "keywords", content: keywords.join(', ') },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: location.pathname + location.search },
        { property: "og:site_name", content: "Companies Directory" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:site", content: "@companies" },
        // Add structured data for search engines
        {
            "script:ld+json": JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": title,
                "description": description,
                "numberOfItems": initialData?.pagination.totalCount || 0,
                "itemListElement": initialData?.companies.slice(0, 10).map((company, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                        "@type": "Organization",
                        "name": company.name,
                        "url": company.domain,
                        "description": company.description,
                        "foundingDate": company.createdAt
                    }
                })) || []
            })
        }
    ];
}