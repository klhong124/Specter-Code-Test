import { Box, Text, Button } from "@chakra-ui/react";

interface CompaniesEmptyStateProps {
    onClearFilters: () => void;
}

export function CompaniesEmptyState({ onClearFilters }: CompaniesEmptyStateProps) {
    return (
        <Box textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.500">
                No companies match your filters
            </Text>
            <Button onClick={onClearFilters} mt={4} variant="outline">
                Clear Filters
            </Button>
        </Box>
    );
}