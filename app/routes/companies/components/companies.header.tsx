import {
    Box,
    Text,
    HStack,
    VStack,
    Badge,
    Button,
    Wrap,
    WrapItem,
    Flex,
} from "@chakra-ui/react";
import { Pill } from "@/ui/pill";
import { useCompaniesContext } from "@companies/context/companies.context";
import { useScroll } from "@/routes/companies/hooks/use-scroll";
import { AnimatePresence, motion } from "framer-motion";
import { CompaniesSorting } from "@companies/components/companies.sorting";
import CountUp from "@ui/count-up";
import { formatFundingAmount, formatFocusLabel } from "@companies/utils/company.helpers";
import { GROWTH_STAGE_OPTIONS } from "@companies/utils/company.constant";

interface CompaniesHeaderProps {
    onOpen: () => void;
}

export function CompaniesHeader({ onOpen }: CompaniesHeaderProps) {
    const {
        hasActiveFilters,
        filters,
        removeFilter,
        clearFilters,
        totalItems,
    } = useCompaniesContext();
    const { scrollY } = useScroll();

    const getStageColorScheme = (stage: string) => {
        const option = GROWTH_STAGE_OPTIONS.find(opt => opt.value === stage);
        return option ? option.colorScheme : 'gray';
    };

    return (
        <VStack
            as="header"
            position="sticky"
            top={0}
            zIndex={10}
            bg="rgba(255, 255, 255, 0.2)"
            backdropFilter="saturate(180%) blur(16px)"
            py={3}
            px={6}
            mt={{ base: -8, lg: 0 }}
            w="full"
            gap={0}
            align="stretch"
            borderRadius={scrollY > 0 ? "xl" : "2xl"}
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.1), inset 0 -1px 0px rgba(255, 255, 255, 0.4)"
            _dark={{
                bg: "rgba(23, 25, 35, 0.5)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 -1px 0px rgba(255, 255, 255, 0.1)",
            }}
        >
            {/* Main Header */}
            <HStack align="center" spacing={3}>

                <Flex
                    direction={{ base: "column", lg: "row" }}
                    align="baseline"
                    mr="auto"
                    gap={{ base: 0, lg: 3 }}

                >
                    <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color="gray.800"
                        _dark={{ color: "whiteAlpha.900" }}
                    >
                        Companies
                    </Text>
                    <Text
                        fontSize="sm"
                        variant="subtle"
                    >
                        <CountUp
                            key={totalItems}
                            from={0}
                            to={totalItems}
                            separator=","
                            duration={0.1}
                            suffix=" results found"
                        />
                    </Text>
                </Flex>
                <Button
                    variant="outline"
                    px={4}
                    onClick={onOpen}
                    display={{ base: "flex", lg: "none" }}
                >
                    Filters
                </Button>
                <CompaniesSorting />
            </HStack>

            <AnimatePresence>
                {hasActiveFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <HStack
                            spacing={4}
                            align="top"
                            justify="space-between"
                            pt={4}
                        >
                            <Wrap spacing={2} flex={1}>
                                <AnimatePresence>
                                    {filters.search && (
                                        <WrapItem key="search-filter">
                                            <Pill
                                                variant="removable"
                                                value={filters.search}
                                                label={`Search: ${filters.search}`}
                                                onChange={() => removeFilter('search')}
                                            />
                                        </WrapItem>
                                    )}
                                    {filters.growthStage.map((v: string) => {
                                        const option = GROWTH_STAGE_OPTIONS.find(opt => opt.value === v);
                                        return (
                                            <WrapItem key={`growthStage-${v}`}>
                                                <Pill
                                                    variant="removable"
                                                    value={v}
                                                    label={option?.label ?? v}
                                                    onChange={() => removeFilter('growthStage', v)}
                                                    colorScheme={getStageColorScheme(v)}
                                                />
                                            </WrapItem>
                                        )
                                    })}
                                    {filters.customerFocus.map((v: string) => (
                                        <WrapItem key={`customerFocus-${v}`}>
                                            <Pill
                                                variant="removable"
                                                value={v}
                                                label={formatFocusLabel(v)}
                                                onChange={() => removeFilter('customerFocus', v)}
                                            />
                                        </WrapItem>
                                    ))}
                                    {filters.fundingType.map((v: string) => (
                                        <WrapItem key={`fundingType-${v}`}>
                                            <Pill
                                                variant="removable"
                                                value={v}
                                                label={v}
                                                onChange={() => removeFilter('fundingType', v)}
                                            />
                                        </WrapItem>
                                    ))}
                                    {filters.minRank != null && (
                                        <WrapItem key="minRank-filter">
                                            <Pill
                                                variant="removable"
                                                value={String(filters.minRank)}
                                                label={`Min Rank: ${filters.minRank}`}
                                                onChange={() => removeFilter('minRank')}
                                            />
                                        </WrapItem>
                                    )}
                                    {filters.maxRank != null && (
                                        <WrapItem key="maxRank-filter">
                                            <Pill
                                                variant="removable"
                                                value={String(filters.maxRank)}
                                                label={`Max Rank: ${filters.maxRank}`}
                                                onChange={() => removeFilter('maxRank')}
                                            />
                                        </WrapItem>
                                    )}
                                    {filters.minFunding != null &&
                                        filters.minFunding !== 0 && (
                                            <WrapItem key="minFunding-filter">
                                                <Pill
                                                    variant="removable"
                                                    value={String(filters.minFunding)}
                                                    label={`Min Funding: ${formatFundingAmount(
                                                        String(filters.minFunding)
                                                    )}`}
                                                    onChange={() =>
                                                        removeFilter('minFunding')
                                                    }
                                                />
                                            </WrapItem>
                                        )}
                                    {filters.maxFunding != null && (
                                        <WrapItem key="maxFunding-filter">
                                            <Pill
                                                variant="removable"
                                                value={String(filters.maxFunding)}
                                                label={`Max Funding: ${formatFundingAmount(
                                                    String(filters.maxFunding)
                                                )}`}
                                                onChange={() =>
                                                    removeFilter('maxFunding')
                                                }
                                            />
                                        </WrapItem>
                                    )}
                                </AnimatePresence>
                            </Wrap>

                            {hasActiveFilters && (
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    colorScheme="orange"
                                    _dark={{
                                        color: "orange.600",
                                    }}
                                    onClick={clearFilters}
                                >
                                    Clear All
                                </Button>
                            )}
                        </HStack>
                    </motion.div>
                )}
            </AnimatePresence>
        </VStack>
    );
}