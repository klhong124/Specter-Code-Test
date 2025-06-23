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
    Text,
    HStack,
    NumberInput,
    NumberInputField,
    Wrap,
    WrapItem,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    SimpleGrid,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCompaniesContext } from "@companies/context/companies.context";
import { formatFundingAmount, formatFocusLabel } from "@companies/utils/company.helpers";
import { GROWTH_STAGE_OPTIONS, CUSTOMER_FOCUSES, FUNDING_TYPES } from "@companies/utils/company.constant";
import { Pill } from "@/ui/pill";

// Color mapping for dark mode
const getDarkModeColors = (colorScheme: string, isSelected: boolean) => {
    if (!isSelected) return { bg: 'transparent', color: 'gray.500', borderBottom: 'gray.700' };

    const colorMap: Record<string, { bg: string; color: string; borderBottom: string }> = {
        orange: { bg: 'orange.800', color: 'orange.100', borderBottom: 'orange.300' },
        purple: { bg: 'purple.800', color: 'purple.100', borderBottom: 'purple.300' },
        teal: { bg: 'teal.800', color: 'teal.100', borderBottom: 'teal.300' },
        blue: { bg: 'blue.800', color: 'blue.100', borderBottom: 'blue.300' },
        gray: { bg: 'gray.600', color: 'gray.100', borderBottom: 'gray.300' },
    };

    return colorMap[colorScheme] || colorMap.blue;
};

// Search Filter Component
function SearchFilter() {
    const { filters, setFilters } = useCompaniesContext();
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

// Rank Filter Component
function RankFilter() {
    const { filters, setFilters } = useCompaniesContext();
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
function FundingAmountFilter() {
    const { filters, setFilters } = useCompaniesContext();
    const [fundingRange, setFundingRange] = useState([0, 100000000]);

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
                <Text fontSize="xs" whiteSpace="nowrap">
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
                <RangeSliderThumb index={0} bg="brand.400" _dark={{ bg: "brand.500" }} />
                <RangeSliderThumb index={1} bg="brand.400" _dark={{ bg: "brand.500" }} />
            </RangeSlider>
        </FormControl>
    );
}

// Growth Stage Filter Component
function GrowthStageFilter() {
    const { filters, setFilters } = useCompaniesContext();
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

                    return (
                        <Button
                            key={option.value}
                            flex={1}
                            size="sm"
                            variant="ghost"
                            borderWidth="1px"
                            borderBottomWidth="2px"
                            onClick={() => handleGrowthStageClick(option.value)}
                            bg={isSelected ? `${option.colorScheme}.50` : 'transparent'}
                            color={isSelected ? `${option.colorScheme}.700` : 'gray.400'}
                            borderColor="gray.200"
                            borderBottomColor={isSelected ? `${option.colorScheme}.500` : 'gray.200'}
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
                            transition="0.2s linear"
                            _dark={{
                                bg: 'transparent',
                                color: isSelected ? `${option.colorScheme}.300` : 'gray.700',
                                borderColor: 'gray.700',
                                borderBottomColor: isSelected ? `${option.colorScheme}.500` : 'gray.700',
                            }}
                        >
                            <Text fontSize="xx-small" variant="inherit">{option.label}</Text>
                        </Button>
                    )
                })}
            </HStack>
        </FormControl>
    );
}

// Customer Focus Filter Component
function CustomerFocusFilter() {
    const { filters, setFilters } = useCompaniesContext();

    return (
        <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium">Customer Focus</FormLabel>
            <CheckboxGroup
                value={filters.customerFocus}
                onChange={(value) => setFilters({ ...filters, customerFocus: value as string[] })}
            >
                <SimpleGrid columns={2} w="200px" gap={2}>
                    {CUSTOMER_FOCUSES.map((focus) => (
                        <Checkbox key={focus} value={focus} size="sm" colorScheme="blue" w="auto">
                            <Text fontSize="sm">{formatFocusLabel(focus)}</Text>
                        </Checkbox>
                    ))}
                </SimpleGrid>
            </CheckboxGroup>
        </FormControl>
    );
}

// Funding Type Filter Component
function FundingTypeFilter() {
    const { filters, setFilters } = useCompaniesContext();

    const handleFundingTypeChange = (clickedValue: string) => {
        const newFundingTypes = filters.fundingType.includes(clickedValue)
            ? filters.fundingType.filter((v) => v !== clickedValue)
            : [...filters.fundingType, clickedValue];
        setFilters({ ...filters, fundingType: newFundingTypes });
    };

    return (
        <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium">Funding Type</FormLabel>
            <Wrap spacing={2}>
                {FUNDING_TYPES.map((type) => (
                    <WrapItem key={type}>
                        <Pill
                            variant="checkbox"
                            value={type}
                            label={type}
                            isSelected={filters.fundingType.includes(type)}
                            onChange={handleFundingTypeChange}
                        />
                    </WrapItem>
                ))}
            </Wrap>
        </FormControl>
    );
}

export function CompanyFilters() {
    const { clearFilters, hasActiveFilters } = useCompaniesContext();

    return (
        <VStack spacing={6} align="stretch" flex={1} minH={0} display="flex" flexDirection="column" maxH="calc(100dvh - 10rem)">
            <HStack justifyContent="space-between">
                <Heading size="md" display={{ base: 'none', lg: 'block' }}>Filters</Heading>
                <AnimatePresence>

                    {hasActiveFilters && (
                        <Button
                            as={motion.button}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition="0.2s linear"
                            size="xs"
                            colorScheme="orange"
                            _dark={{
                                color: "orange.600",
                            }}
                            variant="ghost"
                            onClick={clearFilters}
                        >
                            Clear All
                        </Button>
                    )}
                </AnimatePresence>
            </HStack>

            <VStack align="stretch" spacing={6} flex={1} overflowY="auto" mr={-5} pr={5} >
                <SearchFilter />
                <Divider />
                <RankFilter />
                <Divider />
                <FundingAmountFilter />
                <Divider />
                <GrowthStageFilter />
                <Divider />
                <CustomerFocusFilter />
                <Divider />
                <FundingTypeFilter />
            </VStack>
        </VStack>
    );
}