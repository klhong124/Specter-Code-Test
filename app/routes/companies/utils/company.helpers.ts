/**
 * Formats funding amount from string to human-readable string
 */
export const formatFundingAmount = (amount: string | null): string => {
    if (amount === null) {
        return "N/A";
    }
    const num = Number(amount);
    if (isNaN(num)) return "N/A";
    if (num >= 1_000_000_000) {
        return `$${(num / 1_000_000_000).toFixed(1)}B`;
    }
    if (num >= 1_000_000) {
        return `$${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
        return `$${(num / 1_000).toFixed(1)}K`;
    }
    return `$${num}`;
};

export const formatFocusLabel = (focus: string): string => {
    if (!focus) return '';
    return focus.replace(/_/g, ' & ').toUpperCase();
};

export const safeParseInt = (str: string | null): number | undefined => {
    if (!str) return undefined;
    const num = parseInt(str, 10);
    return isNaN(num) ? undefined : num;
};

import type { CompaniesQuery } from "@companies/types/company.type";
export const generateURLSearchParams = (query: CompaniesQuery): string => {
    const searchParams = new URLSearchParams();
    if (query.page) searchParams.set('page', query.page.toString());
    if (query.search) searchParams.set('search', query.search);
    if (query.growthStage) {
        query.growthStage.forEach((stage: string) => searchParams.append('growthStage', stage));
    }
    if (query.customerFocus) {
        query.customerFocus.forEach((focus: string) => searchParams.append('customerFocus', focus));
    }
    if (query.fundingType) {
        query.fundingType.forEach((type: string) => searchParams.append('fundingType', type));
    }
    if (query.sortBy) searchParams.set('sortBy', query.sortBy);
    if (query.sortOrder) searchParams.set('sortOrder', query.sortOrder);
    if (query.minRank) searchParams.set('minRank', query.minRank.toString());
    if (query.maxRank) searchParams.set('maxRank', query.maxRank.toString());
    if (query.minFunding) searchParams.set('minFunding', query.minFunding.toString());
    if (query.maxFunding) searchParams.set('maxFunding', query.maxFunding.toString());
    return searchParams.toString()
};
