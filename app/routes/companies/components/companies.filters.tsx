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
import { GROWTH_STAGE_OPTIONS, CUSTOMER_FOCUS_OPTIONS, FUNDING_TYPES } from "@companies/utils/company.constant";
import { Pill } from "@/ui/pill";
import { WarningIcon } from "@chakra-ui/icons";

// Search Filter Component
function SearchFilter() {
    const { query, setQuery } = useCompaniesContext();
    const [inputValue, setInputValue] = useState(query.search);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (inputValue !== query.search) {
                setQuery({ ...query, search: inputValue });
            }
        }, 500); // Debounce delay

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, query, setQuery]);

    // Sync local state if query are cleared externally
    useEffect(() => {
        if (query.search !== inputValue) {
            setInputValue(query.search);
        }
    }, [query.search]);


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
    const { query, setQuery } = useCompaniesContext();

    const hasRankError = query.minRank != null &&
        query.maxRank != null &&
        query.minRank > query.maxRank;

    return (
        <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium">Rank</FormLabel>
            <VStack align="stretch" spacing={2}>
                <HStack spacing={2}>
                    <NumberInput
                        size="sm"
                        value={query.minRank || ''}
                        onChange={(_, value) => setQuery({ ...query, minRank: value || undefined })}
                        allowMouseWheel
                    >
                        <NumberInputField placeholder="Min" />
                    </NumberInput>
                    <NumberInput
                        size="sm"
                        value={query.maxRank || ''}
                        onChange={(_, value) => setQuery({ ...query, maxRank: value || undefined })}
                        allowMouseWheel
                    >
                        <NumberInputField placeholder="Max" />
                    </NumberInput>
                </HStack>
                {hasRankError && (
                    <HStack spacing={1} >
                        <WarningIcon boxSize={3} color="red.500" _dark={{ color: "red.400" }} />
                        <Text fontSize="xs" color="red.600" _dark={{ color: "red.300" }}>
                            Min rank cannot be greater than max rank.
                        </Text>
                    </HStack>
                )}
            </VStack>
        </FormControl>
    );
}

// Funding Amount Filter Component
function FundingAmountFilter() {
    const { query, setQuery } = useCompaniesContext();
    const [fundingRange, setFundingRange] = useState([0, 100000000]);

    useEffect(() => {
        setFundingRange([
            query.minFunding || 0,
            query.maxFunding || 100000000,
        ]);
    }, [query.minFunding, query.maxFunding]);

    const handleFundingChangeEnd = (val: number[]) => {
        setQuery({
            ...query,
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
    const { query, setQuery } = useCompaniesContext();
    const handleGrowthStageClick = (clickedValue: string) => {
        const newGrowthStage = query.growthStage.includes(clickedValue)
            ? query.growthStage.filter((v) => v !== clickedValue)
            : [...query.growthStage, clickedValue];
        setQuery({ ...query, growthStage: newGrowthStage });
    };

    return (
        <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium">Growth Stage</FormLabel>
            <HStack spacing={0} w="full">
                {GROWTH_STAGE_OPTIONS.map((option, index) => {
                    const isSelected = query.growthStage.includes(option.value);
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
    const { query, setQuery } = useCompaniesContext();

    return (
        <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium">Customer Focus</FormLabel>
            <CheckboxGroup
                value={query.customerFocus}
                onChange={(value) => setQuery({ ...query, customerFocus: value as string[] })}
            >
                <SimpleGrid columns={2} w="200px" gap={2}>
                    {CUSTOMER_FOCUS_OPTIONS.map((option) => (
                        <Checkbox
                            key={option.value}
                            value={option.value}
                            size="sm"
                            colorScheme={option.colorScheme}
                            w="auto"
                        >
                            <Text fontSize="sm">{option.label}</Text>
                        </Checkbox>
                    ))}
                </SimpleGrid>
            </CheckboxGroup>
        </FormControl>
    );
}

// Funding Type Filter Component
function FundingTypeFilter() {
    const { query, setQuery } = useCompaniesContext();

    const handleFundingTypeChange = (clickedValue: string) => {
        const newFundingTypes = query.fundingType.includes(clickedValue)
            ? query.fundingType.filter((v) => v !== clickedValue)
            : [...query.fundingType, clickedValue];
        setQuery({ ...query, fundingType: newFundingTypes });
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
                            isSelected={query.fundingType.includes(type)}
                            onChange={handleFundingTypeChange}
                        />
                    </WrapItem>
                ))}
            </Wrap>
        </FormControl>
    );
}

export function CompanyFilters() {
    const { clearQuery, hasActiveQuery } = useCompaniesContext();

    return (
        <VStack spacing={6} align="stretch" flex={1} minH={0} display="flex" flexDirection="column" maxH="calc(100dvh - 10rem)">
            <HStack justifyContent="space-between">
                <Heading size="md" display={{ base: 'none', lg: 'block' }}>Filters</Heading>
                <AnimatePresence>
                    {hasActiveQuery && (
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
                            onClick={clearQuery}
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