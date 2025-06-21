export interface Company {
    id: string;
    name: string;
    domain: string;
    rank: number;
    description: string;
    growth_stage: string | null;
    last_funding_type: string | null;
    last_funding_amount: bigint | null;
    customer_focus: string | null;
    createdAt: Date | null;
}