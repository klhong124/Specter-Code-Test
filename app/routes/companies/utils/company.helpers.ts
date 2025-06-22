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

export const safeParseInt = (str: string | null): number | undefined => {
    if (!str) return undefined;
    const num = parseInt(str, 10);
    return isNaN(num) ? undefined : num;
};