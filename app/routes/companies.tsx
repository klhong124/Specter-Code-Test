import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Badge,
    Card,
    CardBody,
    CardHeader,
    SimpleGrid,
    Spinner,
    Alert,
    AlertIcon,
    Link,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FiExternalLink, FiTrendingUp, FiUsers, FiDollarSign } from "react-icons/fi";

interface Company {
    id: string;
    name: string;
    domain: string;
    rank: number;
    description: string;
    growth_stage: string | null;
    last_funding_type: string | null;
    last_funding_amount: bigint | null;
    customer_focus: string | null;
    createdAt: Date | null;
}

async function fetchCompanies(): Promise<{ companies: Company[] }> {
    const response = await fetch('/api/companies');
    if (!response.ok) {
        throw new Error('Failed to fetch companies');
    }
    return response.json();
}

export default function CompaniesPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['companies'],
        queryFn: fetchCompanies,
    });

    const formatFundingAmount = (amount?: bigint | null): string => {
        if (!amount) return 'N/A';
        const num = Number(amount);
        if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
        if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
        return `$${num.toLocaleString()}`;
    };

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={8}>
                <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
                    <VStack spacing={4}>
                        <Spinner size="xl" color="blue.500" />
                        <Text>Loading companies...</Text>
                    </VStack>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxW="container.xl" py={8}>
                <Alert status="error">
                    <AlertIcon />
                    Failed to load companies. Please try again later.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Box textAlign="center">
                    <Heading size="2xl" mb={4} color="gray.800">
                        Top Companies
                    </Heading>
                    <Text fontSize="lg" color="gray.600">
                        Discover the most promising companies in our database
                    </Text>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {data?.companies.map((company: Company) => (
                        <Card key={company.id} variant="outline" _hover={{ shadow: "lg" }} transition="all 0.2s">
                            <CardHeader pb={2}>
                                <VStack align="start" spacing={2}>
                                    <HStack justify="space-between" w="full">
                                        <Heading size="md" noOfLines={1}>
                                            {company.name}
                                        </Heading>
                                        <Badge colorScheme="blue" variant="subtle">
                                            #{company.rank}
                                        </Badge>
                                    </HStack>
                                    <HStack>
                                        <Link
                                            href={`https://${company.domain}`}
                                            isExternal
                                            color="blue.500"
                                            fontSize="sm"
                                            display="flex"
                                            alignItems="center"
                                            gap={1}
                                        >
                                            {company.domain}
                                            <FiExternalLink size={12} />
                                        </Link>
                                    </HStack>
                                </VStack>
                            </CardHeader>

                            <CardBody pt={0}>
                                <VStack align="start" spacing={4}>
                                    <Text fontSize="sm" color="gray.600" noOfLines={3}>
                                        {company.description}
                                    </Text>

                                    <SimpleGrid columns={2} spacing={4} w="full">
                                        {company.growth_stage && (
                                            <Stat size="sm">
                                                <StatLabel fontSize="xs" color="gray.500">
                                                    <HStack spacing={1}>
                                                        <FiTrendingUp size={12} />
                                                        <Text>Stage</Text>
                                                    </HStack>
                                                </StatLabel>
                                                <StatNumber fontSize="sm" fontWeight="medium">
                                                    {company.growth_stage}
                                                </StatNumber>
                                            </Stat>
                                        )}

                                        {company.customer_focus && (
                                            <Stat size="sm">
                                                <StatLabel fontSize="xs" color="gray.500">
                                                    <HStack spacing={1}>
                                                        <FiUsers size={12} />
                                                        <Text>Focus</Text>
                                                    </HStack>
                                                </StatLabel>
                                                <StatNumber fontSize="sm" fontWeight="medium">
                                                    {company.customer_focus}
                                                </StatNumber>
                                            </Stat>
                                        )}
                                    </SimpleGrid>

                                    {company.last_funding_type && (
                                        <Stat size="sm">
                                            <StatLabel fontSize="xs" color="gray.500">
                                                <HStack spacing={1}>
                                                    <FiDollarSign size={12} />
                                                    <Text>Last Funding</Text>
                                                </HStack>
                                            </StatLabel>
                                            <StatNumber fontSize="sm" fontWeight="medium">
                                                {company.last_funding_type}
                                            </StatNumber>
                                            <StatHelpText fontSize="xs">
                                                {formatFundingAmount(company.last_funding_amount)}
                                            </StatHelpText>
                                        </Stat>
                                    )}
                                </VStack>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>
            </VStack>
        </Container>
    );
}