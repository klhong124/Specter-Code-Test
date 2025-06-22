import {
    Card,
    CardBody,
    CardHeader,
    Heading,
    Text,
    VStack,
    HStack,
    Badge,
    Link,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    SimpleGrid,
    Box,
} from "@chakra-ui/react";
import { motion, easeOut } from "framer-motion";
import { FiExternalLink, FiTrendingUp, FiUsers, FiDollarSign } from "react-icons/fi";
import type { Company } from "../types/company.type";
import { formatFundingAmount } from "../utils/company.helpers";

interface CompanyWithPage extends Company {
    _pageNumber: number;
    _pageIndex: number;
}

interface CompanyCardProps {
    company: CompanyWithPage;
    index: number;
}

export function CompanyCard({ company, index }: CompanyCardProps) {
    // Use page-based index for animation delay instead of global index
    const animationIndex = company._pageIndex || 0;

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: animationIndex * 0.05,
                duration: 0.3,
                ease: easeOut
            }
        }
    };

    // Interactive hover animations
    const hoverVariants = {
        hover: {
            y: -4,
            transition: { duration: 0.2, ease: easeOut }
        },
        tap: {
            scale: 0.98,
            transition: { duration: 0.1 }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            style={{ cursor: 'pointer' }}
        >
            <Card
                variant="outline"
                _hover={{ shadow: "lg" }}
                transition="all 0.2s"
            >
                <CardHeader pb={2}>
                    <VStack align="start" spacing={2}>
                        <HStack justify="space-between" w="full">
                            <Heading size="md" noOfLines={1} color="brand.600">
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
                                _hover={{ color: "blue.600" }}
                                transition="color 0.2s"
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
                                    <StatNumber fontSize="sm" fontWeight="medium" color="brand.500">
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
                                    <StatNumber fontSize="sm" fontWeight="medium" color="brand.500">
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
                                <StatNumber fontSize="sm" fontWeight="medium" color="brand.500">
                                    {company.last_funding_type}
                                </StatNumber>
                                <StatHelpText fontSize="xs" color="gray.500">
                                    {formatFundingAmount(company.last_funding_amount)}
                                </StatHelpText>
                            </Stat>
                        )}
                    </VStack>
                </CardBody>
            </Card>
        </motion.div>
    );
}