import { Box, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

interface CompaniesHeaderProps {
    hasActiveFilters: boolean;
    filteredCount: number;
    totalCount: number;
    currentPage?: number;
    totalPages?: number;
    pageSize?: number;
}

export function CompaniesHeader({
    hasActiveFilters,
    filteredCount,
    totalCount,
    currentPage,
    totalPages,
    pageSize
}: CompaniesHeaderProps) {
    const startItem = currentPage && pageSize ? (currentPage - 1) * pageSize + 1 : 1;
    const endItem = currentPage && pageSize ? Math.min(currentPage * pageSize, filteredCount) : filteredCount;

    return (
        <Box textAlign="center">
            <Heading
                size="2xl"
                mb={4}
                color="gray.800"
                as={motion.h1}
                initial={{
                    opacity: 0,
                    y: 24,
                    filter: "blur(12px)",
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                }}
            >
                Top Companies
            </Heading>
            <Text fontSize="lg" color="gray.600" mb={2}>
                Discover the most promising companies in our database
            </Text>
            {hasActiveFilters && (
                <Text fontSize="sm" color="gray.500">
                    Showing {startItem} to {endItem} of {filteredCount} companies
                    {totalCount !== filteredCount && ` (filtered from ${totalCount} total)`}
                </Text>
            )}
            {!hasActiveFilters && totalPages && totalPages > 1 && (
                <Text fontSize="sm" color="gray.500">
                    Showing {startItem} to {endItem} of {totalCount} companies
                </Text>
            )}
        </Box>
    );
}