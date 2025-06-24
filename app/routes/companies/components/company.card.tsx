import {
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
import { ExternalLinkIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { NUMBER_PRT_FETCH } from "@companies/utils/company.constant";
import { useState } from "react";
import type { Company } from "@companies/types/company.type";
import { formatFundingAmount, formatFocusLabel } from "@companies/utils/company.helpers";
import { Pill } from "@/ui/pill";
import { GROWTH_STAGE_OPTIONS } from "@companies/utils/company.constant";
import { GlowingCard } from "@/ui/glowing-card";

interface CompanyCardProps {
    company: Company;
    index: number;
}

export function CompanyCard({ company, index }: CompanyCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const animationIndex = index % NUMBER_PRT_FETCH;
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
        <GlowingCard className="glass" animationIndex={animationIndex}>
            <VStack
                h="full"
                p={6}
                align="stretch"
                spacing={4}
            >
                {/* Top Section */}
                <VStack align="start" spacing={3}>
                    <HStack justify="space-between" w="full" align="start">
                        <HStack spacing={3} align="center" flex={1}>
                            <Box position="relative" boxSize="40px">
                                {!imageLoaded && (
                                    <Skeleton boxSize="40px" borderRadius="md" />
                                )}
                                {!imageError && (
                                    <Image
                                        src={`https://app.tryspecter.com/logo?domain=${company.domain}`}
                                        alt={`${company.name} logo`}
                                        boxSize="40px"
                                        borderRadius="md"
                                        objectFit="cover"
                                        onLoad={() => setImageLoaded(true)}
                                        onError={() => setImageError(true)}
                                        bg="gray.100"
                                        display={imageLoaded ? 'block' : 'none'}
                                    />
                                )}
                                {imageError && (
                                    <Box
                                        boxSize="40px"
                                        borderRadius="md"
                                        bg="gray.100"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontSize="sm"
                                        color="gray.500"
                                    >
                                        ?
                                    </Box>
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

                {/* Bottom Section */}
                <VStack spacing={3} w="full" align="stretch">
                    <Wrap>
                        {company.growth_stage && (
                            <Pill
                                value={company.growth_stage}
                                label={company.growth_stage}
                                colorScheme={getStageColorScheme(company.growth_stage)}
                            />
                        )}
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

                    {company.last_funding_type && (
                        <HStack justify="space-between" align="center">
                            <HStack spacing={2} color="gray.500">
                                <InfoOutlineIcon />
                                <Text fontSize="sm">Last Funding</Text>
                            </HStack>
                            <VStack align="flex-end" spacing={0}>
                                <Text fontSize="sm" fontWeight="medium">
                                    {company.last_funding_type}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    {formatFundingAmount(company.last_funding_amount)}
                                </Text>
                            </VStack>
                        </HStack>
                    )}
                </VStack>
            </VStack>
        </GlowingCard >
    );
}