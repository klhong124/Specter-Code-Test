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
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import type { Filters } from "../types/companies.filters.type";
import { useCompaniesContext } from "../context/companies.context";
import { formatFundingAmount } from "../utils/company.helpers";
import { GROWTH_STAGE_OPTIONS } from "../utils/company.constant";

interface FilterOptions {
    customerFocuses: string[];
    fundingTypes: string[];
}

export interface CompanyFiltersProps {
    filters: Filters;
    setFilters: (filters: Filters) => void;
    filterOptions: FilterOptions;
}

// Search Filter Component
function SearchFilter({ filters, setFilters }: { filters: Filters; setFilters: (filters: Filters) => void }) {
    const [inputValue, setInputValue] = useState(filters.search);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (inputValue !== filters.search) {
                setFilters({ ...filters, search: inputValue });
            }
        }, 500); // Debounce delay

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, filters, setFilters]);

    // Sync local state if filters are cleared externally
    useEffect(() => {
        if (filters.search !== inputValue) {
            setInputValue(filters.search);
        }
    }, [filters.search]);

    return (
        <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium">Search</FormLabel>
            <Input
                placeholder="Search companies..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                size="sm"
            />
        </FormControl>
    );
}

// Sort Filter Component
function SortFilter({ filters, setFilters }: { filters: Filters; setFilters: (filters: Filters) => void }) {
    return (
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
    );
}

// Rank Filter Component
function RankFilter({ filters, setFilters }: { filters: Filters; setFilters: (filters: Filters) => void }) {
    return (
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
    );
}

// Funding Amount Filter Component
function FundingAmountFilter({ filters, setFilters }: { filters: Filters; setFilters: (filters: Filters) => void }) {
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
    );
}

// Growth Stage Filter Component
function GrowthStageFilter({ filters, setFilters }: { filters: Filters; setFilters: (filters: Filters) => void }) {
    const handleGrowthStageClick = (clickedValue: string) => {
        const newGrowthStage = filters.growthStage.includes(clickedValue)
            ? filters.growthStage.filter((v) => v !== clickedValue)
            : [...filters.growthStage, clickedValue];
        setFilters({ ...filters, growthStage: newGrowthStage });
    };

    return (
        <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium">Growth Stage</FormLabel>
            <HStack spacing={0} w="full">
                {GROWTH_STAGE_OPTIONS.map((option, index) => {
                    const isSelected = filters.growthStage.includes(option.value);
                    const isFirst = index === 0;
                    const isLast = index === GROWTH_STAGE_OPTIONS.length - 1;

                    // Selected styles (soft)
                    const selectedBg = useColorModeValue(`${option.colorScheme}.50`, `${option.colorScheme}.800`);
                    const selectedColor = useColorModeValue(`${option.colorScheme}.700`, `${option.colorScheme}.200`);
                    const selectedBottomBorderColor = useColorModeValue(`${option.colorScheme}.500`, `${option.colorScheme}.400`);

                    // Unselected styles
                    const unselectedBg = 'transparent';
                    const unselectedColor = useColorModeValue('gray.400', 'gray.500');
                    const unselectedBorderColor = useColorModeValue('gray.200', 'gray.700');

                    return (
                        <Button
                            as={motion.button}
                            key={option.value}
                            flex={1}
                            size="sm"
                            variant="ghost"
                            borderWidth="1px"
                            borderBottomWidth="2px"
                            onClick={() => handleGrowthStageClick(option.value)}
                            // Set colors directly, no animation on these properties
                            bg={isSelected ? selectedBg : unselectedBg}
                            color={isSelected ? selectedColor : unselectedColor}
                            borderColor={unselectedBorderColor}
                            borderBottomColor={isSelected ? selectedBottomBorderColor : unselectedBorderColor}
                            // Base styles
                            display="flex"
                            flexDirection="column"
                            h="auto"
                            py={2}
                            px={1}
                            ml={!isFirst ? '-1px' : 0}
                            zIndex={isSelected ? 1 : 0}
                            borderTopLeftRadius={isFirst ? 'md' : 0}
                            borderBottomLeftRadius={isFirst ? 'md' : 0}
                            borderTopRightRadius={isLast ? 'md' : 0}
                            borderBottomRightRadius={isLast ? 'md' : 0}
                            // Animation props - only transform and opacity are used
                            transition={{ duration: 0.2, ease: 'easeOut' } as any}
                        >
                            <Text fontSize="xx-small" >{option.label}</Text>
                        </Button>
                    )
                })}
            </HStack>
        </FormControl>
    );
}

// Customer Focus Filter Component
function CustomerFocusFilter({ filters, setFilters, filterOptions }: { filters: Filters; setFilters: (filters: Filters) => void; filterOptions: FilterOptions }) {
    return (
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
    );
}

// Funding Type Filter Component
function FundingTypeFilter({ filters, setFilters, filterOptions }: { filters: Filters; setFilters: (filters: Filters) => void; filterOptions: FilterOptions }) {
    return (
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
    );
}

// Active Filters Component (Mobile)
function ActiveFiltersMobile({ filters, removeFilter, clearFilters }: {
    filters: Filters;
    removeFilter: (key: keyof Filters, value?: any) => void;
    clearFilters: () => void;
}) {
    return (
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
    );
}

export function CompanyFilters({ filters, setFilters, filterOptions }: CompanyFiltersProps) {
    const { removeFilter, clearFilters, hasActiveFilters } = useCompaniesContext();
    const isMobile = useBreakpointValue({ base: true, lg: false });

    return (
        <VStack spacing={6} align="stretch" h="full">
            <Box display={{ base: 'none', lg: 'block' }}>
                <Heading size="md">Filters</Heading>
            </Box>

            {isMobile && hasActiveFilters && (
                <ActiveFiltersMobile
                    filters={filters}
                    removeFilter={removeFilter}
                    clearFilters={clearFilters}
                />
            )}

            <VStack align="stretch" spacing={6} overflowY="auto" mr={-3} pr={4} h="calc(100vh - 10rem)">
                <SearchFilter filters={filters} setFilters={setFilters} />
                <Divider />
                <SortFilter filters={filters} setFilters={setFilters} />

                <Box>
                    <VStack spacing={6} align="stretch">
                        <Divider />
                        <RankFilter filters={filters} setFilters={setFilters} />
                        <Divider />
                        <FundingAmountFilter filters={filters} setFilters={setFilters} />
                        <Divider />
                        <GrowthStageFilter filters={filters} setFilters={setFilters} />
                        <Divider />
                        <CustomerFocusFilter filters={filters} setFilters={setFilters} filterOptions={filterOptions} />
                        <Divider />
                        <FundingTypeFilter filters={filters} setFilters={setFilters} filterOptions={filterOptions} />
                    </VStack>
                </Box>
            </VStack>
        </VStack>
    );
}