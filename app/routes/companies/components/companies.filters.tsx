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
    NumberInput,
    NumberInputField,
    Wrap,
    WrapItem,
    Tag,
    TagLabel,
    TagCloseButton,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import type { Filters } from "../types/companies.filters.type";

interface FilterOptions {
    growthStages: string[];
    customerFocuses: string[];
    fundingTypes: string[];
}

export interface CompanyFiltersProps {
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
            minRank: undefined,
            maxRank: undefined,
            minFunding: undefined,
            maxFunding: undefined,
        });
    };

    const hasActiveFilters = filters.search || filters.growthStage.length > 0 || filters.customerFocus.length > 0 || filters.fundingType.length > 0 || filters.minRank !== undefined || filters.maxRank !== undefined || filters.minFunding !== undefined || filters.maxFunding !== undefined;

    return (
        <VStack spacing={6} align="stretch" h="full">
            <Box>
                <Heading size="md" mb={4}>Filters</Heading>
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
                <FormLabel fontSize="sm" fontWeight="medium">Rank</FormLabel>
                <HStack spacing={2}>
                    <NumberInput
                        size="sm"
                        value={filters.minRank}
                        onChange={(_, value) => setFilters({ ...filters, minRank: value || undefined })}
                        allowMouseWheel
                    >
                        <NumberInputField placeholder="Min" />
                    </NumberInput>
                    <NumberInput
                        size="sm"
                        value={filters.maxRank}
                        onChange={(_, value) => setFilters({ ...filters, maxRank: value || undefined })}
                        allowMouseWheel
                    >
                        <NumberInputField placeholder="Max" />
                    </NumberInput>
                </HStack>
            </FormControl>

            <Divider />

            <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">Last Funding Amount (USD)</FormLabel>
                <HStack spacing={2}>
                    <NumberInput
                        size="sm"
                        value={filters.minFunding}
                        onChange={(_, value) => setFilters({ ...filters, minFunding: value || undefined })}
                        allowMouseWheel
                    >
                        <NumberInputField placeholder="Min" />
                    </NumberInput>
                    <NumberInput
                        size="sm"
                        value={filters.maxFunding}
                        onChange={(_, value) => setFilters({ ...filters, maxFunding: value || undefined })}
                        allowMouseWheel
                    >
                        <NumberInputField placeholder="Max" />
                    </NumberInput>
                </HStack>
            </FormControl>

            <Divider />

            <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">Growth Stage</FormLabel>
                <CheckboxGroup
                    value={filters.growthStage}
                    onChange={(value) => setFilters({ ...filters, growthStage: value as string[] })}
                >
                    <Wrap spacing={2}>
                        {filterOptions.growthStages.map((stage) => (
                            <WrapItem key={stage}>
                                <Checkbox value={stage} size="sm" colorScheme="blue">
                                    <Text fontSize="sm">{stage}</Text>
                                </Checkbox>
                            </WrapItem>
                        ))}
                    </Wrap>
                </CheckboxGroup>
            </FormControl>

            <Divider />

            <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">Customer Focus</FormLabel>
                <CheckboxGroup
                    value={filters.customerFocus}
                    onChange={(value) => setFilters({ ...filters, customerFocus: value as string[] })}
                >
                    <Wrap spacing={2}>
                        {filterOptions.customerFocuses.map((focus) => (
                            <WrapItem key={focus}>
                                <Checkbox value={focus} size="sm" colorScheme="blue">
                                    <Text fontSize="sm">{focus}</Text>
                                </Checkbox>
                            </WrapItem>
                        ))}
                    </Wrap>
                </CheckboxGroup>
            </FormControl>

            <Divider />

            <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">Funding Type</FormLabel>
                <CheckboxGroup
                    value={filters.fundingType}
                    onChange={(value) => setFilters({ ...filters, fundingType: value as string[] })}
                >
                    <Wrap spacing={2}>
                        {filterOptions.fundingTypes.map((type) => (
                            <WrapItem key={type}>
                                <Checkbox value={type} size="sm" colorScheme="blue">
                                    <Text fontSize="sm">{type}</Text>
                                </Checkbox>
                            </WrapItem>
                        ))}
                    </Wrap>
                </CheckboxGroup>
            </FormControl>
        </VStack>
    );
}