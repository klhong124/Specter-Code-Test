/**
 * Formats funding amount from string to human-readable string
 */
export function formatFundingAmount(amount?: string | null): string {
    if (!amount) return 'N/A';
    const num = Number(amount);
    if (isNaN(num)) return 'N/A';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toLocaleString()}`;
}