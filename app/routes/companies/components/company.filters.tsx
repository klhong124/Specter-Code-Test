import {
    VStack,
    Box,
    Heading,
    Button,
    Input,
    Divider,
    FormControl,
    FormLabel,
    Checkbox,
    CheckboxGroup,
    Stack,
    Text,
    Select,
    HStack,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";

export interface Filters {
    search: string;
    growthStage: string[];
    customerFocus: string[];
    fundingType: string[];
    sortBy: 'name' | 'rank';
    sortOrder: 'asc' | 'desc';
}

interface FilterOptions {
    growthStages: string[];
    customerFocuses: string[];
    fundingTypes: string[];
}

interface CompanyFiltersProps {
    filters: Filters;
    setFilters: (filters: Filters) => void;
    filterOptions: FilterOptions;
}

export function CompanyFilters({ filters, setFilters, filterOptions }: CompanyFiltersProps) {
    const clearFilters = () => {
        setFilters({
            search: '',
            growthStage: [],
            customerFocus: [],
            fundingType: [],
            sortBy: 'rank',
            sortOrder: 'asc',
        });
    };

    const hasActiveFilters = filters.search || filters.growthStage.length > 0 || filters.customerFocus.length > 0 || filters.fundingType.length > 0;

    return (
        <VStack spacing={6} align="stretch" h="full">
            <Box>
                <Heading size="md" mb={4}>Filters</Heading>
                {hasActiveFilters && (
                    <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<FiX />}
                        onClick={clearFilters}
                        mb={4}
                    >
                        Clear All
                    </Button>
                )}
            </Box>

            <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">Search</FormLabel>
                <Input
                    placeholder="Search companies..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    size="sm"
                />
            </FormControl>

            <Divider />

            <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">Sort By</FormLabel>
                <HStack spacing={3}>
                    <Select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as 'name' | 'rank' })}
                        size="sm"
                        flex={1}
                    >
                        <option value="rank">Rank</option>
                        <option value="name">Name</option>
                    </Select>
                    <Select
                        value={filters.sortOrder}
                        onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' })}
                        size="sm"
                        w="100px"
                    >
                        <option value="asc">↑</option>
                        <option value="desc">↓</option>
                    </Select>
                </HStack>
            </FormControl>

            <Divider />

            <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">Growth Stage</FormLabel>
                <CheckboxGroup
                    value={filters.growthStage}
                    onChange={(value) => setFilters({ ...filters, growthStage: value as string[] })}
                >
                    <Stack spacing={2}>
                        {filterOptions.growthStages.map((stage) => (
                            <Checkbox key={stage} value={stage} size="sm">
                                <Text fontSize="sm">{stage}</Text>
                            </Checkbox>
                        ))}
                    </Stack>
                </CheckboxGroup>
            </FormControl>

            <Divider />

            <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">Customer Focus</FormLabel>
                <CheckboxGroup
                    value={filters.customerFocus}
                    onChange={(value) => setFilters({ ...filters, customerFocus: value as string[] })}
                >
                    <Stack spacing={2}>
                        {filterOptions.customerFocuses.map((focus) => (
                            <Checkbox key={focus} value={focus} size="sm">
                                <Text fontSize="sm">{focus}</Text>
                            </Checkbox>
                        ))}
                    </Stack>
                </CheckboxGroup>
            </FormControl>

            <Divider />

            <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">Funding Type</FormLabel>
                <CheckboxGroup
                    value={filters.fundingType}
                    onChange={(value) => setFilters({ ...filters, fundingType: value as string[] })}
                >
                    <Stack spacing={2}>
                        {filterOptions.fundingTypes.map((type) => (
                            <Checkbox key={type} value={type} size="sm">
                                <Text fontSize="sm">{type}</Text>
                            </Checkbox>
                        ))}
                    </Stack>
                </CheckboxGroup>
            </FormControl>
        </VStack>
    );
}