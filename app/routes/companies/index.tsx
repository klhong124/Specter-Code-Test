import {
    Box,
    Container,
    VStack,
    HStack,
    Center,
    SimpleGrid,
    useDisclosure,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useCallback } from "react";
import { CompanyCard } from '@companies/components/company.card';
import { CompaniesHeader } from '@companies/components/companies.header';
import { CompaniesSidebar } from '@companies/components/companies.sidebar';
import { CompaniesEmptyState } from '@companies/components/companies.empty.state';
import { CompaniesErrorState } from '@companies/components/companies.error.state';
import { CompaniesMobileDrawer } from '@companies/components/companies.mobile.drawer';
import { CompaniesProvider, useCompaniesContext } from '@companies/context/companies.context';

function CompaniesPageContent() {
    const {
        companies,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useCompaniesContext();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Intersection Observer for infinite scroll
    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading) return;

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        });

        if (node) observerRef.current.observe(node);
    }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Cleanup observer on unmount
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    if (error) {
        return <CompaniesErrorState />;
    }

    return (
        <Box
            minH="100dvh"
            bgImage="url(bg.png)"
            bgSize="cover"
            bgPosition="top"
            bgRepeat="no-repeat"
            bgAttachment="fixed"
            pos="relative"
            zIndex={0}
            _before={{
                content: '""',
                pos: "absolute",
                inset: 0,
                bgColor: "rgba(255, 255, 255, 0.6)",
                zIndex: -1,
            }}
            _dark={{
              _before: {
                bgColor: "rgba(0, 0, 0, 0.7)",
              }
            }}

        >
            <Container maxW="container.xl">
                <HStack spacing={8} align="start">
                    {/* Desktop Side Panel */}
                    <Box
                        position="sticky"
                        top="0"
                        h="100dvh"
                        display={{ base: "none", lg: "block" }}
                    >
                        <CompaniesSidebar />
                    </Box>

                    {/* Main Content */}
                    <Box flex={1} py={8}>
                        <VStack spacing={0} align="stretch">
                            {/* Header */}
                            <CompaniesHeader onOpen={onOpen} />

                            {/* Main Content Area */}
                            <Box pt={8}>
                                <VStack spacing={8} align="stretch">
                                    <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6}>
                                        {companies.map((company, index) => (
                                            <div
                                                key={company.id}
                                                ref={index === companies.length - 3 ? lastElementRef : undefined}
                                            >
                                                <CompanyCard
                                                    company={company}
                                                    index={index}
                                                />
                                            </div>
                                        ))}
                                    </SimpleGrid>

                                    {companies.length === 0 && !isLoading && (
                                        <CompaniesEmptyState />
                                    )}

                                    {/* Loading indicator for infinite scroll */}
                                    {isFetchingNextPage && (
                                        <Center py={8}>
                                            <VStack spacing={4}>
                                                <Spinner size="lg" color="blue.500" />
                                                <Text color="gray.600">Loading more companies...</Text>
                                            </VStack>
                                        </Center>
                                    )}

                                    {/* End of results indicator */}
                                    {!hasNextPage && companies.length > 0 && (
                                        <Center py={8}>
                                            <Text color="gray.500" fontSize="sm">
                                                You've reached the end of the results
                                            </Text>
                                        </Center>
                                    )}
                                </VStack>
                            </Box>
                        </VStack>
                    </Box>
                </HStack>
            </Container>

            {/* Mobile Drawer */}
            <CompaniesMobileDrawer isOpen={isOpen} onClose={onClose} />
        </Box>
    );
}

export default function CompaniesPage() {
    return (
        <CompaniesProvider>
            <CompaniesPageContent />
        </CompaniesProvider>
    );
}