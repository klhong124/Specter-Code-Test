import { Box, Button, Flex, Image, useColorModeValue, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router";
import { CompanyFilters } from "./companies.filters";
import { useCompaniesContext } from "../context/companies.context";
import { HiArrowLeft } from "react-icons/hi";
import { FiMoon, FiSun } from "react-icons/fi";

export function CompaniesSidebar() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { filters, setFilters, filterOptions } = useCompaniesContext();

    const glassBg = useColorModeValue("rgba(255, 255, 255, 0.6)", "rgba(26, 32, 44, 0.6)");
    const glassBorder = useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)");
    const logoFilter = useColorModeValue("none", "brightness(0) invert(1)");

    return (
        <Flex
            display={{ base: "none", lg: "block" }}
            flexDirection="column"
            position="sticky"
            top="2rem"
            h="calc(100vh - 4rem)"
        >
            <Flex justify="space-between" align="center" mb={8}>
                <Button
                    variant="ghost"
                    as={Link}
                    to="/"
                    _hover={{
                        bg: "transparent",
                    }}
                    p={0}
                >
                    <Image src="/specter.svg" alt="Specter" h={8} filter={logoFilter} />
                </Button>
                <Button onClick={toggleColorMode} variant="ghost" size="sm">
                    {colorMode === 'light' ? <FiMoon /> : <FiSun />}
                </Button>
            </Flex>

            <Box
                w="350px"
                flexShrink={0}
                bg={glassBg}
                backdropFilter="blur(12px)"
                border="1px solid"
                borderColor={glassBorder}
                boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
                borderRadius="xl"
                p={6}
                display="flex"
                flexDirection="column"
                flex={1}
                minH={0}
            >
                <CompanyFilters
                    filters={filters}
                    setFilters={setFilters}
                    filterOptions={filterOptions}
                />
            </Box>
        </Flex>

    );
}