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
import { useEffect, useRef, useCallback, useState } from "react";
import { CompanyCard } from '@companies/components/company.card';
import { CompaniesHeader } from '@companies/components/companies.header';
import { CompaniesSidebar } from '@companies/components/companies.sidebar';
import { CompaniesEmptyState } from '@companies/components/companies.empty.state';
import { CompaniesErrorState } from '@companies/components/companies.error.state';
import { CompaniesMobileDrawer } from '@companies/components/companies.mobile.drawer';
import { CompaniesProvider, useCompaniesContext } from '@companies/context/companies.context';
import { GlowingCard } from "@/ui/glowing-card";
import { ViewIcon } from "@chakra-ui/icons";
import type { CompaniesApiResponse, CompaniesQuery } from "./types/company.type";
import { safeParseInt } from "@companies/utils/company.helpers";
import { fetchCompanies } from "./api/companies.fetch";

export async function loader({ request }: { request: Request }) {
    try {
        const url = new URL(request.url);
        const params = url.searchParams;

        // Extract and validate parameters
        const page = Math.max(1, safeParseInt(params.get('page')) || 1);
        const sortBy = params.get('sortBy') || 'rank';
        const sortOrder = params.get('sortOrder') || 'asc';
        const validSortBy = ['name', 'rank', 'last_funding_amount'].includes(sortBy) ? sortBy : 'rank';
        const validSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'asc';

        const initialQuery: CompaniesQuery = {
            page,
            search: params.get('search') || undefined,
            growthStage: params.getAll('growthStage'),
            customerFocus: params.getAll('customerFocus'),
            fundingType: params.getAll('fundingType'),
            sortBy: validSortBy as 'name' | 'rank' | 'last_funding_amount',
            sortOrder: validSortOrder as 'asc' | 'desc',
            minRank: safeParseInt(params.get('minRank')),
            maxRank: safeParseInt(params.get('maxRank')),
            minFunding: safeParseInt(params.get('minFunding')),
            maxFunding: safeParseInt(params.get('maxFunding')),
        };

        const initialData = await fetchCompanies(initialQuery);
        return {
            initialData,
            initialQuery
        };
    } catch (error) {
        console.error('Error in loader:', error);
        return {
            initialData: {
                companies: [],
                pagination: {
                    page: 1,
                    limit: 10,
                    totalCount: 0,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false,
                    nextPage: null,
                    previousPage: null
                }
            },
            initialQuery: {
                page: 1,
                search: undefined,
                growthStage: [],
                customerFocus: [],
                fundingType: [],
                sortBy: 'rank',
                sortOrder: 'asc',
                minRank: undefined,
                maxRank: undefined,
                minFunding: undefined,
                maxFunding: undefined,
            },
        } satisfies {
            initialData: CompaniesApiResponse;
            initialQuery: CompaniesQuery;
        };
    }
}

function CompaniesPageContent() {
    const {
        companies,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        query,
        hasActiveQuery,
    } = useCompaniesContext();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const observerRef = useRef<IntersectionObserver | null>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    // Measure header height when filters change
    useEffect(() => {
        if (headerRef.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    setHeaderHeight(entry.contentRect.height);
                }
            });
            resizeObserver.observe(headerRef.current);
            return () => resizeObserver.disconnect();
        }
    }, [hasActiveQuery, query]);

    // Scroll to top when companies change (filters changed)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [query]);

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
                backdropFilter: "blur(1px)",
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

                    {/* Main Section */}
                    <VStack spacing={0} flex={1} py={8} align="stretch" position="relative">

                        {/* Header */}
                        <CompaniesHeader ref={headerRef} onOpen={onOpen} />

                        {/* Main Content Area */}
                        <Box
                            pt={`${headerHeight + 32}px`}
                            overflowY="scroll"
                            overflowX="hidden"
                            h={`calc(100dvh - 64px)`}
                            mr={-8}
                            pr={8}
                        >
                            <VStack spacing={8} align="stretch">
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
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
                                    <GlowingCard className="glass">
                                        <Center my={8}>
                                            <VStack spacing={2}>
                                                <ViewIcon color="gray.400" boxSize={6} />
                                                <Text variant="muted" fontSize="sm">
                                                    You've reached the end of the results
                                                </Text>
                                            </VStack>
                                        </Center>
                                    </GlowingCard>
                                )}
                            </VStack>
                        </Box>
                    </VStack>

                </HStack>
            </Container>

            {/* Mobile Drawer */}
            <CompaniesMobileDrawer isOpen={isOpen} onClose={onClose} />
        </Box>
    );
}

export default function CompaniesPage({ loaderData }: {
    loaderData: {
        initialData: CompaniesApiResponse;
        initialQuery: CompaniesQuery;
    }
}) {
    const { initialData, initialQuery } = loaderData || {};
    return (
        <CompaniesProvider
            initialData={initialData}
            initialQuery={initialQuery}
        >
            <CompaniesPageContent />
        </CompaniesProvider>
    );
}