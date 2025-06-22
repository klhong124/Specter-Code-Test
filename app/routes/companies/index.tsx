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
    useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useRef, useCallback } from "react";
import { CompanyCard } from './components/company.card';
import { CompaniesHeader } from './components/companies.header';
import { CompaniesSidebar } from './components/companies.sidebar';
import { CompaniesEmptyState } from './components/companies.empty.state';
import { CompaniesErrorState } from './components/companies.error.state';
import { CompaniesMobileDrawer } from './components/companies.mobile.drawer';
import { CompaniesProvider, useCompaniesContext } from './context/companies.context';

function CompaniesPageContent() {
    const {
        companies,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useCompaniesContext();

    const overlayBg = useColorModeValue("rgba(255, 255, 255, 0.4)", "rgba(0, 0, 0, 0.6)");
    const pageBg = useColorModeValue("gray.50", "black");

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
            bg={pageBg}
            bgImage="url(bg.png)"
            bgSize="contain"
            bgPosition="top"
            bgRepeat="no-repeat"
            bgAttachment="fixed"
            pos="relative"
            zIndex={0}
            _before={{
                content: '""',
                pos: "absolute",
                inset: 0,
                bgColor: overlayBg,
                zIndex: -1,
                backdropFilter: "blur(1px)",
            }}
        >
            <Container maxW="container.xl" py={8}>
                <HStack spacing={6} align="start">
                    {/* Desktop Side Panel */}
                    <CompaniesSidebar />

                    {/* Main Content */}
                    <Box flex={1}>
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