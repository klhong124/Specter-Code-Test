import { HStack, Button, Select, Text, Box } from "@chakra-ui/react";
import { useCompaniesContext } from "../context/companies.context";

export function CompaniesPagination() {
    const {
        currentPage,
        totalPages,
        pageSize,
        totalItems,
        handlePageChange,
        handlePageSizeChange,
    } = useCompaniesContext();

    const pageSizeOptions = [10, 20, 50, 100];

    return (
        <Box>
            <HStack justify="space-between" align="center" spacing={4}>
                <HStack spacing={2}>
                    <Button
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        isDisabled={currentPage <= 1}
                    >
                        Previous
                    </Button>

                    <Text fontSize="sm" color="gray.600">
                        Page {currentPage} of {totalPages}
                    </Text>

                    <Button
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        isDisabled={currentPage >= totalPages}
                    >
                        Next
                    </Button>
                </HStack>

                <HStack spacing={2} align="center">
                    <Text fontSize="sm" color="gray.600">
                        Show:
                    </Text>
                    <Select
                        size="sm"
                        w="auto"
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </Select>
                    <Text fontSize="sm" color="gray.600">
                        per page
                    </Text>
                </HStack>
            </HStack>
        </Box>
    );
}