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
    Image,
    Skeleton,
} from "@chakra-ui/react";
import { motion, easeOut } from "framer-motion";
import { useState } from "react";
import { FiExternalLink, FiTrendingUp, FiUsers, FiDollarSign } from "react-icons/fi";
import type { Company } from "../types/company.type";
import { formatFundingAmount } from "../utils/company.helpers";

interface CompanyCardProps {
    company: Company;
    index: number;
}

export function CompanyCard({ company, index }: CompanyCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Use current index for animation delay instead of page index
    // This ensures proper animation when sorting changes
    const animationIndex = index % 20; // Use modulo to keep delays reasonable

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

    // Logo animation variants
    const logoVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: easeOut
            }
        }
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true); // Mark as loaded to hide skeleton
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
                    <VStack align="start" spacing={3}>
                        <HStack justify="space-between" w="full" align="start">
                            <HStack spacing={3} align="center" flex={1}>
                                <Box position="relative" boxSize="40px">
                                    {/* Skeleton while loading */}
                                    {!imageLoaded && (
                                        <Skeleton
                                            boxSize="40px"
                                            borderRadius="md"
                                            startColor="gray.200"
                                            endColor="gray.300"
                                        />
                                    )}

                                    {/* Logo image */}
                                    {!imageError && (
                                        <motion.div
                                            initial="hidden"
                                            animate={imageLoaded ? "visible" : "hidden"}
                                            variants={logoVariants}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%'
                                            }}
                                        >
                                            <Image
                                                src={`https://app.tryspecter.com/logo?domain=${company.domain}`}
                                                alt={`${company.name} logo`}
                                                boxSize="40px"
                                                borderRadius="md"
                                                objectFit="cover"
                                                onLoad={handleImageLoad}
                                                onError={handleImageError}
                                                bg="gray.100"
                                            />
                                        </motion.div>
                                    )}

                                    {/* Fallback placeholder */}
                                    {imageError && (
                                        <motion.div
                                            initial="hidden"
                                            animate="visible"
                                            variants={logoVariants}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%'
                                            }}
                                        >
                                            <Box
                                                boxSize="40px"
                                                borderRadius="md"
                                                bg="gray.100"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                fontSize="sm"
                                                color="gray.500"
                                                fontWeight="medium"
                                            >
                                                ?
                                            </Box>
                                        </motion.div>
                                    )}
                                </Box>
                                <VStack align="start" spacing={1} flex={1}>
                                    <Heading size="md" noOfLines={1} color="brand.600">
                                        {company.name}
                                    </Heading>
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
                                </VStack>
                            </HStack>
                            <Badge colorScheme="blue" variant="subtle">
                                #{company.rank}
                            </Badge>
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