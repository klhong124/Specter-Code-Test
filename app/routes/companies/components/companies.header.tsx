import {
    Box,
    Text,
    HStack,
    VStack,
    Badge,
    Button,
    Wrap,
    WrapItem,
    Flex,
    useColorMode,
    IconButton,
    Spacer,
} from "@chakra-ui/react";
import { Pill } from "@/ui/pill";
import { useCompaniesContext } from "@companies/context/companies.context";
import { AnimatePresence, motion } from "framer-motion";
import { CompaniesSorting } from "@companies/components/companies.sorting";
import CountUp from "@ui/count-up";
import { formatFundingAmount, formatFocusLabel } from "@companies/utils/company.helpers";
import { GROWTH_STAGE_OPTIONS } from "@companies/utils/company.constant";
import { MoonIcon, SunIcon, HamburgerIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { forwardRef } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface CompaniesHeaderProps {
    onOpen: () => void;
    ref?: React.Ref<HTMLDivElement>;
}

export const CompaniesHeader = forwardRef<HTMLDivElement, { onOpen: () => void }>(
    ({ onOpen }, ref) => {
        const { colorMode, toggleColorMode } = useColorMode();
        const navigate = useNavigate();

        const {
            hasActiveQuery,
            query,
            removeQuery,
            clearQuery,
            totalItems,
        } = useCompaniesContext();

        const getStageColorScheme = (stage: string) => {
            const option = GROWTH_STAGE_OPTIONS.find(opt => opt.value === stage);
            return option ? option.colorScheme : 'gray';
        };

        return (
            <VStack
                ref={ref}
                as="header"
                position="absolute"
                top={0}
                zIndex={10}
                py={4}
                px={6}
                ml="-2px"
                w="calc(100% + 4px)"
                align="stretch"
                borderTopRadius="none"
                backdropFilter="saturate(180%) blur(16px)"
                className="glass"
            >
                {/* Main Header */}
                <Wrap align="center" spacing={2}>
                    <IconButton
                        aria-label="Go back to home"
                        icon={<ArrowBackIcon />}
                        onClick={() => navigate('/')}
                        variant="ghost"
                        display={{ base: "block", lg: "none" }}
                        size="md"
                    />
                    <Flex
                        direction={{ base: "column", lg: "row" }}
                        align="baseline"
                        mr="auto"
                        gap={{ base: 0, lg: 3 }}
                    >

                        <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            color="gray.800"
                            _dark={{ color: "whiteAlpha.900" }}
                        >
                            Companies
                        </Text>
                        <Text
                            fontSize="sm"
                            variant="subtle"
                        >
                            <CountUp
                                key={totalItems}
                                from={0}
                                to={totalItems}
                                separator=","
                                duration={0.1}
                                suffix=" results found"
                            />
                        </Text>
                    </Flex>
                    <HStack spacing={2} ml="auto">
                        <CompaniesSorting />
                        <IconButton
                            aria-label="Toggle dark mode"
                            icon={colorMode === "light" ? <SunIcon /> : <MoonIcon />}
                            onClick={toggleColorMode}
                            variant="ghost"
                            display={{ base: "flex", lg: "none" }}
                            size="md"
                        />
                        <IconButton
                            aria-label="Toggle filters"
                            icon={<HamburgerIcon />}
                            onClick={onOpen}
                            variant="ghost"
                            display={{ base: "flex", lg: "none" }}
                            size="md"
                        />
                    </HStack>

                </Wrap>

                {hasActiveQuery && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'visible' }}
                    >
                        <HStack
                            spacing={4}
                            align="top"
                            justify="space-between"
                            pt={4}
                            position="relative"
                        >
                            <Wrap spacing={2} flex={1}>
                                <AnimatePresence mode="popLayout">
                                    {query.search && (
                                        <WrapItem key="search-filter">
                                            <Pill
                                                variant="removable"
                                                value={query.search}
                                                label={`Search: ${query.search}`}
                                                onChange={() => removeQuery('search')}
                                            />
                                        </WrapItem>
                                    )}
                                    {query.growthStage.map((v: string) => {
                                        const option = GROWTH_STAGE_OPTIONS.find(opt => opt.value === v);
                                        return (
                                            <WrapItem key={`growthStage-${v}`}>
                                                <Pill
                                                    variant="removable"
                                                    value={v}
                                                    label={option?.label ?? v}
                                                    onChange={() => removeQuery('growthStage', v)}
                                                    colorScheme={getStageColorScheme(v)}
                                                />
                                            </WrapItem>
                                        )
                                    })}
                                    {query.customerFocus.map((v: string) => (
                                        <WrapItem key={`customerFocus-${v}`}>
                                            <Pill
                                                variant="removable"
                                                value={v}
                                                label={formatFocusLabel(v)}
                                                onChange={() => removeQuery('customerFocus', v)}
                                            />
                                        </WrapItem>
                                    ))}
                                    {query.fundingType.map((v: string) => (
                                        <WrapItem key={`fundingType-${v}`}>
                                            <Pill
                                                variant="removable"
                                                value={v}
                                                label={v}
                                                onChange={() => removeQuery('fundingType', v)}
                                            />
                                        </WrapItem>
                                    ))}
                                    {query.minRank != null && (
                                        <WrapItem key="minRank-filter">
                                            <Pill
                                                variant="removable"
                                                value={String(query.minRank)}
                                                label={`Min Rank: #${query.minRank}`}
                                                onChange={() => removeQuery('minRank')}
                                            />
                                        </WrapItem>
                                    )}
                                    {query.maxRank != null && (
                                        <WrapItem key="maxRank-filter">
                                            <Pill
                                                variant="removable"
                                                value={String(query.maxRank)}
                                                label={`Max Rank: #${query.maxRank}`}
                                                onChange={() => removeQuery('maxRank')}
                                            />
                                        </WrapItem>
                                    )}
                                    {query.minFunding != null &&
                                        query.minFunding !== 0 && (
                                            <WrapItem key="minFunding-filter">
                                                <Pill
                                                    variant="removable"
                                                    value={String(query.minFunding)}
                                                    label={`Min Funding: ${formatFundingAmount(
                                                        String(query.minFunding)
                                                    )}`}
                                                    onChange={() =>
                                                        removeQuery('minFunding')
                                                    }
                                                />
                                            </WrapItem>
                                        )}
                                    {query.maxFunding != null && (
                                        <WrapItem key="maxFunding-filter">
                                            <Pill
                                                variant="removable"
                                                value={String(query.maxFunding)}
                                                label={`Max Funding: ${formatFundingAmount(
                                                    String(query.maxFunding)
                                                )}`}
                                                onChange={() =>
                                                    removeQuery('maxFunding')
                                                }
                                            />
                                        </WrapItem>
                                    )}
                                </AnimatePresence>
                            </Wrap>

                            {hasActiveQuery && (
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    colorScheme="orange"
                                    _dark={{
                                        color: "orange.600",
                                    }}
                                    onClick={clearQuery}
                                >
                                    Clear All
                                </Button>
                            )}
                        </HStack>
                    </motion.div>
                )}
            </VStack>
        );
    }
);

CompaniesHeader.displayName = "CompaniesHeader";