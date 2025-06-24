import {
    VStack,
    SimpleGrid,
    Center,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { CompanyCard } from './company.card';
import { CompaniesEmptyState } from './companies.empty.state';
import { GlowingCard } from "@/ui/glowing-card";
import { ViewIcon } from "@chakra-ui/icons";
import { useCompaniesContext } from "../context/companies.context";

interface CompaniesFeedProps {
    lastElementRef: (node: HTMLDivElement) => void;
}

export function CompaniesFeed({
    lastElementRef,
}: CompaniesFeedProps) {
    const {
        companies,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
    } = useCompaniesContext();

    return (
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
    );
}