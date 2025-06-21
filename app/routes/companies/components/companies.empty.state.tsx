import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { useCompaniesContext } from "../context/companies.context";

export function CompaniesEmptyState() {
    const { clearFilters } = useCompaniesContext();

    return (
        <Box textAlign="center" py={12}>
            <VStack spacing={4}>
                <Text fontSize="lg" color="gray.600">
                    No companies found matching your criteria.
                </Text>
                <Button onClick={clearFilters} colorScheme="blue">
                    Clear Filters
                </Button>
            </VStack>
        </Box>
    );
}