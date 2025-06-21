import { Box, Text, HStack, Button, useDisclosure } from "@chakra-ui/react";
import { useCompaniesContext } from "../context/companies.context";

export function CompaniesHeader() {
    const { hasActiveFilters, totalItems, currentPage, totalPages, pageSize } = useCompaniesContext();
    const { isOpen, onToggle } = useDisclosure();

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <Box>
            <HStack justify="space-between" align="center" mb={4}>
                <Box>
                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        Companies
                    </Text>
                    <Text color="gray.600">
                        {hasActiveFilters ? (
                            <>
                                Showing {startItem}-{endItem} of {totalItems} filtered companies
                            </>
                        ) : (
                            `Showing ${startItem}-${endItem} of ${totalItems} companies`
                        )}
                    </Text>
                </Box>

                <Button
                    variant="outline"
                    onClick={onToggle}
                    display={{ base: "flex", lg: "none" }}
                >
                    Filters
                </Button>
            </HStack>
        </Box>
    );
}