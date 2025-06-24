// Number of companies to fetch per page, aka limit
export const NUMBER_PRT_FETCH = 20;

export const GROWTH_STAGE_OPTIONS = [
    { value: 'seed', label: 'Seed', colorScheme: 'orange' },
    { value: 'early', label: 'Early', colorScheme: 'purple' },
    { value: 'growing', label: 'Growing', colorScheme: 'teal' },
    { value: 'late', label: 'Late', colorScheme: 'blue' },
    { value: 'exit', label: 'Exit', colorScheme: 'gray' },
];

export const CUSTOMER_FOCUS_OPTIONS = [
    { value: 'b2b', label: 'B2B', colorScheme: 'orange' },
    { value: 'b2c', label: 'B2C', colorScheme: 'purple' },
    { value: 'b2b_b2c', label: 'B2B & B2C', colorScheme: 'teal' },
    { value: 'b2c_b2b', label: 'B2C & B2B', colorScheme: 'cyan' },
];

export const CUSTOMER_FOCUSES = ['b2b', 'b2b_b2c', 'b2c', 'b2c_b2b'];

export const FUNDING_TYPES = [
    'Angel',
    'Convertible Note',
    'Corporate Round',
    'Debt Financing',
    'Equity Crowdfunding',
    'Grant',
    'Initial Coin Offering',
    'Non Equity Assistance',
    'Post Ipo Equity',
    'Pre Seed',
    'Private Equity',
    'Product Crowdfunding',
    'Secondary Market',
    'Seed',
    'Series A',
    'Series B',
    'Series C',
    'Series D',
    'Series G',
    'Series Unknown',
    'Undisclosed',
];