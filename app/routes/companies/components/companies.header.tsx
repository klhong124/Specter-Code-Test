import {
    Box,
    Text,
    HStack,
    VStack,
    Badge,
    Button,
    Wrap,
    WrapItem,
    Tag,
    TagLabel,
    TagCloseButton,
} from "@chakra-ui/react";
import { useCompaniesContext } from "@companies/context/companies.context";
// import { useAutoHidingHeader } from "@companies/hooks/useAutoHidingHeader";
import { motion } from "framer-motion";
import { CompaniesSorting } from "@companies/components/companies.sorting";
import CountUp from "@ui/count-up";

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
    // const { isHidden } = useAutoHidingHeader();

    return (
        <Box
            as="header"
            position="sticky"
            top={0}
            zIndex={10}
            bg="rgba(255, 255, 255, 0.2)"
            backdropFilter="saturate(180%) blur(16px)"
            py={3}
            px={6}
            w="full"
            borderBottomRadius="xl"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.1), inset 0 -1px 0px rgba(255, 255, 255, 0.4)"
            _dark={{
                bg: "rgba(23, 25, 35, 0.5)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 -1px 0px rgba(255, 255, 255, 0.1)",
            }}
        >
            <VStack spacing={3} align="stretch">
                {/* Main Header */}
                <HStack justify="space-between" align="center" spacing={3}>
                    <Box
                        as={motion.div}
                        // animate={{ height: isHidden ? 0 : 'auto', opacity: isHidden ? 0 : 1 }}
                        transition={{ duration: 0.2, ease: 'easeOut' } as any}
                        overflow="hidden"
                    >
                        <HStack spacing={2} align="baseline">
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
                        </HStack>
                        {hasActiveFilters && (
                            <Text
                                variant="subtle"
                                fontSize="sm"
                            >
                                Filtered results
                            </Text>
                        )}
                    </Box>

                    <HStack spacing={4}>
                        <CompaniesSorting />
                        <Button
                            variant="outline"
                            onClick={onOpen}
                            display={{ base: "flex", lg: "none" }}
                        >
                            Filters
                        </Button>
                    </HStack>
                </HStack>

                {/* Active Filters */}
                {hasActiveFilters && (
                    <Box pt={2}>
                        <HStack spacing={4} align="center" justify="space-between">
                            <Wrap spacing={2} flex={1}>
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

                            <Button
                                size="xs"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={clearFilters}
                            >
                                Clear All
                            </Button>
                        </HStack>
                    </Box>
                )}
            </VStack>
        </Box>
    );
}