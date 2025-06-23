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
    Box,
    Image,
    Skeleton,
    Wrap,
} from "@chakra-ui/react";
import { ExternalLinkIcon, ArrowUpIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { motion, easeOut } from "framer-motion";
import { useState } from "react";
import type { Company } from "@companies/types/company.type";
import { formatFundingAmount, formatFocusLabel } from "@companies/utils/company.helpers";
import { Pill } from "@/ui/pill";
import { GROWTH_STAGE_OPTIONS } from "@companies/utils/company.constant";

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

    const getStageColorScheme = (stage?: string | null) => {
        if (!stage) return 'gray';
        const lowerCaseStage = stage.toLowerCase();

        const option = GROWTH_STAGE_OPTIONS.find(opt => lowerCaseStage.includes(opt.value));
        if (option) {
            return option.colorScheme;
        }

        if (lowerCaseStage.includes('series')) {
            const lateStageOption = GROWTH_STAGE_OPTIONS.find(opt => opt.value === 'late');
            return lateStageOption ? lateStageOption.colorScheme : 'blue';
        }

        return 'gray';
    };

    const getFocusColorScheme = (focus?: string | null) => {
        if (!focus) return 'gray';
        if (focus === 'b2c') return 'purple';
        if (focus === 'b2b') return 'orange';
        if (focus === 'b2b_b2c') return 'teal';
        return 'gray';
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
                className="glass"
                borderRadius="xl"
                _hover={{
                    shadow: "lg",
                }}
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
                                    <Heading size="md" noOfLines={1} color="brand.600" _dark={{ color: "brand.300" }}>
                                        {company.name}
                                    </Heading>
                                    <Link
                                        href={`https://${company.domain}`}
                                        isExternal
                                        variant="external"
                                        fontSize="sm"
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                        transition="color 0.2s"
                                    >
                                        {company.domain}
                                        <ExternalLinkIcon mx="2px" />
                                    </Link>
                                </VStack>
                            </HStack>
                            <Badge colorScheme="blue" variant="subtle">
                                #{company.rank}
                            </Badge>
                        </HStack>
                    </VStack>
                </CardHeader>

                <CardBody pt={2}>
                    <VStack align="start" spacing={4}>
                        <Wrap>
                            {
                                company.growth_stage && (
                                    <Pill
                                        value={company.growth_stage}
                                        label={company.growth_stage}
                                        colorScheme={getStageColorScheme(company.growth_stage)}
                                    />
                                )
                            }
                            {company.customer_focus && (
                                <Pill
                                    value={company.customer_focus}
                                    label={formatFocusLabel(company.customer_focus)}
                                    colorScheme={getFocusColorScheme(company.customer_focus)}
                                />
                            )}
                        </Wrap>

                        <Text fontSize="sm" variant="subtle" noOfLines={3}>
                            {company.description}
                        </Text>

                        <VStack spacing={3} w="full" align="stretch">
                            {/* Last Funding */}
                            {company.last_funding_type && (
                                <Wrap align="baseline" gap={2}>
                                    <InfoOutlineIcon boxSize={4} alignSelf="center" />
                                    <Text fontSize="sm">Last Funding - </Text>
                                    <Text fontSize="xs" color="gray.500" mr="auto">
                                        {formatFundingAmount(company.last_funding_amount)}
                                    </Text>
                                    <Badge colorScheme="brand" py={1} px={2}>
                                        {company.last_funding_type}
                                    </Badge>
                                </Wrap>
                            )}
                        </VStack>
                    </VStack>
                </CardBody>
            </Card>
        </motion.div>
    );
}