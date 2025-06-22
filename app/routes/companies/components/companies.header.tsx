import {
    Box,
    Text,
    HStack,
    VStack,
    Badge,
    Button,
    useColorModeValue,
    Wrap,
    WrapItem,
    Tag,
    TagLabel,
    TagCloseButton,
} from "@chakra-ui/react";
import { useCompaniesContext } from "@companies/context/companies.context";
import { useAutoHidingHeader } from "@companies/hooks/useAutoHidingHeader";
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

    const headerBg = useColorModeValue("rgba(255, 255, 255, 0.6)", "rgba(28, 30, 33, 0.6)");
    const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
    const subtleTextColor = useColorModeValue("gray.600", "whiteAlpha.700");

    return (
        <Box
            as="header"
            position="sticky"
            top={0}
            zIndex={10}
            bg={headerBg}
            backdropFilter="blur(12px)"
            py={3}
            px={4}
            w="full"
            // This creates the fade-out effect at the bottom
            _after={{
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '40px',
                background: 'linear-gradient(to top, transparent, var(--chakra-colors-chakra-body-bg))',
                maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                pointerEvents: 'none',
            }}
        >
            <VStack spacing={3} align="stretch">
                {/* Main Header */}
                <HStack justify="space-between" align="center">
                    <Box
                        as={motion.div}
                        // animate={{ height: isHidden ? 0 : 'auto', opacity: isHidden ? 0 : 1 }}
                        transition={{ duration: 0.2, ease: 'easeOut' } as any}
                        overflow="hidden"
                    >
                        <HStack spacing={2} align="baseline">
                            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                                Companies
                            </Text>
                            <Text fontSize="sm" color={subtleTextColor}>
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
                            <Text color={subtleTextColor} fontSize="sm">
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