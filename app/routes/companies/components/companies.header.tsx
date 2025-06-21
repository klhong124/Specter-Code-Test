import { Box, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

interface CompaniesHeaderProps {
    hasActiveFilters: boolean;
    filteredCount: number;
    totalCount: number;
}

export function CompaniesHeader({ hasActiveFilters, filteredCount, totalCount }: CompaniesHeaderProps) {
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
                    Showing {filteredCount} of {totalCount} companies
                </Text>
            )}
        </Box>
    );
}