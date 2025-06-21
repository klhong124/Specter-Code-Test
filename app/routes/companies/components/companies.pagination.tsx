import { HStack, Button, Text, Select, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CompaniesPaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

export function CompaniesPagination({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
}: CompaniesPaginationProps) {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show pages around current page
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + maxVisiblePages - 1);

            // Adjust start if we're near the end
            if (end === totalPages) {
                start = Math.max(1, end - maxVisiblePages + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <VStack
            w="full"
            p={4}
            bg="white"
            borderRadius="lg"
            shadow="sm"
            border="1px"
            borderColor="gray.200"
            spacing={4}
        >
            {/* Page Info */}
            <Text fontSize="sm" color="gray.600" textAlign="center">
                Showing {startItem} to {endItem} of {totalItems} companies
            </Text>

            {/* Pagination Controls */}
            <HStack spacing={2} flexWrap="wrap" justify="center">
                {/* Previous Button */}
                <Button
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    size="sm"
                    variant="outline"
                    leftIcon={<FiChevronLeft />}
                    onClick={() => onPageChange(currentPage - 1)}
                    isDisabled={currentPage === 1}
                >
                    <Text display={{ base: "none", sm: "block" }}>Previous</Text>
                </Button>

                {/* Page Numbers */}
                {pageNumbers.map((page) => (
                    <Button
                        key={page}
                        as={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        size="sm"
                        variant={page === currentPage ? "solid" : "outline"}
                        colorScheme={page === currentPage ? "brand" : "gray"}
                        onClick={() => onPageChange(page)}
                        minW="40px"
                    >
                        {page}
                    </Button>
                ))}

                {/* Next Button */}
                <Button
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    size="sm"
                    variant="outline"
                    rightIcon={<FiChevronRight />}
                    onClick={() => onPageChange(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                >
                    <Text display={{ base: "none", sm: "block" }}>Next</Text>
                </Button>
            </HStack>

            {/* Page Size Selector */}
            <HStack spacing={2} justify="center">
                <Text fontSize="sm" color="gray.600">
                    Show:
                </Text>
                <Select
                    size="sm"
                    w="70px"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </Select>
            </HStack>
        </VStack>
    );
}