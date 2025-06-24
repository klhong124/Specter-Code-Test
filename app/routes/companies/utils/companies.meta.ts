import type { CompaniesApiResponse, CompaniesQuery } from "../types/company.type";

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

    // Build title with more context
    if (searchTerm) {
        title = `Companies matching "${searchTerm}"`;
    } else if (growthStage) {
        title = `${growthStage} Companies`;
    } else if (customerFocus) {
        title = `${customerFocus} Companies`;
    } else if (fundingType) {
        title = `${fundingType} Companies`;
    }

    // Build rich description using SSR data
    let description = "Discover and explore innovative companies across various industries and growth stages.";

    if (searchTerm) {
        description = `Find ${initialData?.pagination.totalCount || ''} companies matching "${searchTerm}". Browse through detailed company information, funding history, and growth metrics.`;
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

        if (filters.length > 0) {
            description = `Browse ${initialData.pagination.totalCount} companies filtered by ${filters.join(', ')}. Explore detailed company profiles, funding history, and growth metrics.`;
        } else {
            description = `Browse ${initialData.pagination.totalCount} companies. Filter by growth stage, customer focus, funding type, rank, and funding amount.`;
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
        { title: title + ' | Specter' },
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