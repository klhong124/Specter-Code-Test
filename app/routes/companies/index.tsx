import {
    Box,
    Container,
    VStack,
    HStack,
    Center,
    SimpleGrid,
    useDisclosure,
} from "@chakra-ui/react";
import { useCompanies } from "./hooks";
import { CompanyCard } from './components/company.card';
import { CompaniesHeader } from './components/companies.header';
import { CompaniesSidebar } from './components/companies.sidebar';
import { CompaniesMobileFilter } from './components/companies.mobile.filter';
import { CompaniesEmptyState } from './components/companies.empty.state';
import { CompaniesLoadingState } from './components/companies.loading.state';
import { CompaniesErrorState } from './components/companies.error.state';
import { CompaniesMobileDrawer } from './components/companies.mobile.drawer';
import { CompaniesPagination } from './components/companies.pagination';

export default function CompaniesPage() {
    const {
        companies,
        isLoading,
        error,
        filters,
        setFilters,
        filterOptions,
        clearFilters,
        hasActiveFilters,
        // Pagination
        currentPage,
        totalPages,
        pageSize,
        totalItems,
        handlePageChange,
        handlePageSizeChange,
    } = useCompanies();

    const { isOpen, onOpen, onClose } = useDisclosure();

    if (isLoading) {
        return <CompaniesLoadingState />;
    }

    if (error) {
        return <CompaniesErrorState />;
    }

    return (
        <Center
            minH="100dvh"
            bgImage="url(bg.png)"
            bgSize="cover"
            bgPosition="center"
            pos="relative"
            zIndex={0}
            _before={{
                content: '""',
                pos: "absolute",
                inset: 0,
                bgColor: "rgba(255, 255, 255, 0.6)",
                zIndex: -1,
                filter: "blur(1px)",
                backdropFilter: "blur(1px)",
            }}
        >
            <Container maxW="container.xl" py={8}>
                <HStack spacing={6} align="start">
                    {/* Desktop Side Panel */}
                    <CompaniesSidebar
                        filters={filters}
                        setFilters={setFilters}
                        filterOptions={filterOptions}
                    />

                    {/* Mobile Filter Button */}
                    <CompaniesMobileFilter onOpen={onOpen} />

                    {/* Main Content */}
                    <Box flex={1}>
                        <VStack spacing={8} align="stretch">
                            <CompaniesHeader
                                hasActiveFilters={hasActiveFilters}
                                filteredCount={totalItems}
                                totalCount={totalItems}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                pageSize={pageSize}
                            />

                            <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6}>
                                {companies.map((company, index) => (
                                    <CompanyCard
                                        key={company.id}
                                        company={company}
                                        index={index}
                                    />
                                ))}
                            </SimpleGrid>

                            {companies.length === 0 && (
                                <CompaniesEmptyState onClearFilters={clearFilters} />
                            )}

                            {/* Pagination */}
                            {companies.length > 0 && totalPages > 1 && (
                                <CompaniesPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    pageSize={pageSize}
                                    totalItems={totalItems}
                                    onPageChange={handlePageChange}
                                    onPageSizeChange={handlePageSizeChange}
                                />
                            )}
                        </VStack>
                    </Box>
                </HStack>
            </Container>

            {/* Mobile Drawer */}
            <CompaniesMobileDrawer
                isOpen={isOpen}
                onClose={onClose}
                filters={filters}
                setFilters={setFilters}
                filterOptions={filterOptions}
            />
        </Center>
    );
}