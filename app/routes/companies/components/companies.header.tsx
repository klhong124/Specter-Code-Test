import {
    Box,
    Text,
    HStack,
    VStack,
    Badge,
    Progress,
    Button,
    useColorModeValue,
    Wrap,
    WrapItem,
    Tag,
    TagLabel,
    TagCloseButton,
} from "@chakra-ui/react";
import { useCompaniesContext } from "../context/companies.context";

interface CompaniesHeaderProps {
    onOpen: () => void;
}

export function CompaniesHeader({ onOpen }: CompaniesHeaderProps) {
    const {
        companies,
        totalItems,
        loadedPages,
        hasActiveFilters,
        filters,
        isLoading,
        isFetchingNextPage,
        removeFilter,
        clearFilters,
    } = useCompaniesContext();

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    const loadedCount = companies.length;
    const totalCount = totalItems;
    const progressPercentage = totalCount > 0 ? (loadedCount / totalCount) * 100 : 0;

    // Calculate active filter count
    const activeFilterCount = [
        filters.search,
        filters.growthStage.length,
        filters.customerFocus.length,
        filters.fundingType.length,
        filters.minRank,
        filters.maxRank,
        filters.minFunding,
        filters.maxFunding,
    ].filter(v => v !== undefined && v !== 0 && (Array.isArray(v) ? v.length > 0 : true)).length;

    return (
        <Box
            position="sticky"
            top={0}
            zIndex={10}
            bg={bgColor}
            borderBottom="1px"
            borderColor={borderColor}
            backdropFilter="blur(10px)"
            bgColor={`${bgColor}CC`}
            py={3}
            px={4}
        >
            <VStack spacing={3} align="stretch">
                {/* Main Header */}
                <HStack justify="space-between" align="center">
                    <Box>
                        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                            Companies
                        </Text>
                        {hasActiveFilters && (
                            <Text color="gray.600" fontSize="sm">
                                Filtered results
                            </Text>
                        )}
                    </Box>

                    <Button
                        variant="outline"
                        onClick={onOpen}
                        display={{ base: "flex", lg: "none" }}
                    >
                        Filters
                    </Button>
                </HStack>

                {/* Status and Progress */}
                <HStack justify="space-between" align="center" spacing={4}>
                    {/* Left side - Status info */}
                    <VStack align="start" spacing={1} flex={1}>
                        <HStack spacing={3} align="center">
                            <Badge
                                colorScheme={hasActiveFilters ? "orange" : "blue"}
                                variant="subtle"
                                fontSize="xs"
                            >
                                {hasActiveFilters ? `${activeFilterCount} filters active` : "All companies"}
                            </Badge>
                            {loadedPages > 1 && (
                                <Badge
                                    colorScheme="green"
                                    variant="subtle"
                                    fontSize="xs"
                                >
                                    {loadedPages} pages loaded
                                </Badge>
                            )}
                        </HStack>

                        <HStack spacing={2} align="center">
                            <Text fontSize="xs" color="gray.600">
                                {loadedCount} of {totalCount} companies loaded
                            </Text>
                            {isFetchingNextPage && (
                                <Text fontSize="xs" color="blue.500" fontWeight="medium">
                                    Loading more...
                                </Text>
                            )}
                        </HStack>
                    </VStack>

                    {/* Right side - Progress bar */}
                    <VStack align="end" spacing={1} minW="200px">
                        <HStack spacing={2} align="center">
                            <Text fontSize="xs" color="gray.600">
                                Progress
                            </Text>
                            <Text fontSize="xs" fontWeight="medium" color="gray.700">
                                {Math.round(progressPercentage)}%
                            </Text>
                        </HStack>
                        <Progress
                            value={progressPercentage}
                            size="sm"
                            colorScheme="blue"
                            borderRadius="full"
                            w="200px"
                            bg={useColorModeValue("gray.100", "gray.700")}
                        />
                    </VStack>
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

            {/* Loading indicator */}
            {isLoading && (
                <Box mt={2}>
                    <Progress
                        size="xs"
                        isIndeterminate
                        colorScheme="blue"
                        borderRadius="full"
                    />
                </Box>
            )}
        </Box>
    );
}