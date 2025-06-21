import {
    Box,
    Container,
    VStack,
    HStack,
    Center,
    SimpleGrid,
    useDisclosure,
} from "@chakra-ui/react";
import { CompanyCard } from './components/company.card';
import { CompaniesHeader } from './components/companies.header';
import { CompaniesSidebar } from './components/companies.sidebar';
import { CompaniesMobileFilter } from './components/companies.mobile.filter';
import { CompaniesEmptyState } from './components/companies.empty.state';
import { CompaniesLoadingState } from './components/companies.loading.state';
import { CompaniesErrorState } from './components/companies.error.state';
import { CompaniesMobileDrawer } from './components/companies.mobile.drawer';
import { CompaniesPagination } from './components/companies.pagination';
import { CompaniesProvider, useCompaniesContext } from './context/companies.context';

function CompaniesPageContent() {
    const {
        companies,
        isLoading,
        error,
        filters,
        setFilters,
        filterOptions,
        clearFilters,
        hasActiveFilters,
        currentPage,
        totalPages,
        pageSize,
        totalItems,
        handlePageChange,
        handlePageSizeChange,
    } = useCompaniesContext();

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
                    <CompaniesSidebar />

                    {/* Mobile Filter Button */}
                    <CompaniesMobileFilter onOpen={onOpen} />

                    {/* Main Content */}
                    <Box flex={1}>
                        <VStack spacing={8} align="stretch">
                            <CompaniesHeader />

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
                                <CompaniesEmptyState />
                            )}

                            {/* Pagination */}
                            {companies.length > 0 && totalPages > 1 && (
                                <CompaniesPagination />
                            )}
                        </VStack>
                    </Box>
                </HStack>
            </Container>

            {/* Mobile Drawer */}
            <CompaniesMobileDrawer isOpen={isOpen} onClose={onClose} />
        </Center>
    );
}

export default function CompaniesPage() {
    return (
        <CompaniesProvider>
            <CompaniesPageContent />
        </CompaniesProvider>
    );
}