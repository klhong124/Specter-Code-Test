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
    useBreakpointValue,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    useColorModeValue,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import type { Filters } from "../types/companies.filters.type";
import { useCompaniesContext } from "../context/companies.context";
import { formatFundingAmount } from "../utils/company.helpers";

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
    const { removeFilter, clearFilters, hasActiveFilters } = useCompaniesContext();
    const isMobile = useBreakpointValue({ base: true, lg: false });
    const [fundingRange, setFundingRange] = useState([0, 100000000]);
    const thumbBg = useColorModeValue("brand.200", "brand.800");

    useEffect(() => {
        setFundingRange([
            filters.minFunding || 0,
            filters.maxFunding || 100000000,
        ]);
    }, [filters.minFunding, filters.maxFunding]);

    const handleFundingChangeEnd = (val: number[]) => {
        setFilters({
            ...filters,
            minFunding: val[0],
            maxFunding: val[1] === 100000000 ? undefined : val[1],
        });
    };

    return (
        <VStack spacing={6} align="stretch" h="full">
            <Box display={{ base: 'none', lg: 'block' }}>
                <Heading size="md">Filters</Heading>
            </Box>

            {isMobile && hasActiveFilters && (
                <Box>
                    <HStack justify="space-between" my={2}>
                        <Text fontSize="sm" fontWeight="medium">Active Filters</Text>
                        <Button
                            size="xs"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={clearFilters}
                        >
                            Clear All
                        </Button>
                    </HStack>
                    <Wrap spacing={2}>
                        {filters.search && (
                            <WrapItem>
                                <Tag size="sm" variant="outline" colorScheme="blue">
                                    <TagLabel>Search: {filters.search}</TagLabel>
                                    <TagCloseButton onClick={() => removeFilter('search')} />
                                </Tag>
                            </WrapItem>
                        )}
                        {filters.growthStage.map((v: string) => (
                            <WrapItem key={v}>
                                <Tag size="sm" variant="outline" colorScheme="blue">
                                    <TagLabel>{v}</TagLabel>
                                    <TagCloseButton onClick={() => removeFilter('growthStage', v)} />
                                </Tag>
                            </WrapItem>
                        ))}
                        {filters.customerFocus.map((v: string) => (
                            <WrapItem key={v}>
                                <Tag size="sm" variant="outline" colorScheme="blue">
                                    <TagLabel>{v}</TagLabel>
                                    <TagCloseButton onClick={() => removeFilter('customerFocus', v)} />
                                </Tag>
                            </WrapItem>
                        ))}
                        {filters.fundingType.map((v: string) => (
                            <WrapItem key={v}>
                                <Tag size="sm" variant="outline" colorScheme="blue">
                                    <TagLabel>{v}</TagLabel>
                                    <TagCloseButton onClick={() => removeFilter('fundingType', v)} />
                                </Tag>
                            </WrapItem>
                        ))}
                        {filters.minRank && (
                            <WrapItem>
                                <Tag size="sm" variant="outline" colorScheme="blue">
                                    <TagLabel>Min Rank: {filters.minRank}</TagLabel>
                                    <TagCloseButton onClick={() => removeFilter('minRank')} />
                                </Tag>
                            </WrapItem>
                        )}
                        {filters.maxRank && (
                            <WrapItem>
                                <Tag size="sm" variant="outline" colorScheme="blue">
                                    <TagLabel>Max Rank: {filters.maxRank}</TagLabel>
                                    <TagCloseButton onClick={() => removeFilter('maxRank')} />
                                </Tag>
                            </WrapItem>
                        )}
                        {filters.minFunding && (
                            <WrapItem>
                                <Tag size="sm" variant="outline" colorScheme="blue">
                                    <TagLabel>Min Funding: {filters.minFunding}</TagLabel>
                                    <TagCloseButton onClick={() => removeFilter('minFunding')} />
                                </Tag>
                            </WrapItem>
                        )}
                        {filters.maxFunding && (
                            <WrapItem>
                                <Tag size="sm" variant="outline" colorScheme="blue">
                                    <TagLabel>Max Funding: {filters.maxFunding}</TagLabel>
                                    <TagCloseButton onClick={() => removeFilter('maxFunding')} />
                                </Tag>
                            </WrapItem>
                        )}
                    </Wrap>
                    <Divider my={4} />
                </Box>
            )}

            <VStack align="stretch" spacing={6} overflowY="auto" mr={-3} pr={4} h="calc(100vh - 10rem)">
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

                <Box >
                    <VStack spacing={6} align="stretch">
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
                            <VStack align="flex-start" mb={2}>
                                <FormLabel fontSize="sm" fontWeight="medium" m={0}>Last Funding Amount (USD)</FormLabel>
                                <Text fontSize="xs" color="gray.500" whiteSpace="nowrap">
                                    {formatFundingAmount(String(fundingRange[0]))} - {fundingRange[1] === 100000000 ? `${formatFundingAmount(String(fundingRange[1]))}+` : formatFundingAmount(String(fundingRange[1]))}
                                </Text>
                            </VStack>
                            <RangeSlider
                                w="calc(100% - 1rem)"
                                ml={2}
                                aria-label={['min-funding', 'max-funding']}
                                min={0}
                                max={100000000}
                                step={1000000}
                                value={fundingRange}
                                onChange={(val) => setFundingRange(val)}
                                onChangeEnd={handleFundingChangeEnd}
                                colorScheme="brand"
                            >
                                <RangeSliderTrack>
                                    <RangeSliderFilledTrack />
                                </RangeSliderTrack>
                                <RangeSliderThumb index={0} bg={thumbBg} />
                                <RangeSliderThumb index={1} bg={thumbBg} />
                            </RangeSlider>
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
                </Box>
            </VStack>
        </VStack>
    );
}