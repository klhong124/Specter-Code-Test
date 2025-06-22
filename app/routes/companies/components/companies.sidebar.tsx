import { Box, Button, Flex, Image, useColorModeValue, useColorMode, VStack } from "@chakra-ui/react";
import { Link } from "react-router";
import { CompanyFilters } from "./companies.filters";
import { FiMoon, FiSun } from "react-icons/fi";
import { memo } from "react";

const SpecterLogo = memo(function SpecterLogo() {
    const { colorMode, toggleColorMode } = useColorMode();
    const logoFilter = useColorModeValue("none", "brightness(0) invert(1)");

    return (
        <Flex justify="space-between" align="center" my={8}>
            <Button
                variant="ghost"
                as={Link}
                to="/"
                _hover={{
                    bg: "transparent",
                }}
                p={4}
            >
                <Image src="/specter.svg" alt="Specter" h={8} filter={logoFilter} />
            </Button>
            <Button onClick={toggleColorMode} variant="ghost" size="sm">
                {colorMode === 'light' ? <FiMoon /> : <FiSun />}
            </Button>
        </Flex>
    );
});

export function CompaniesSidebar() {
    const glassBg = useColorModeValue("rgba(255, 255, 255, 0.6)", "rgba(26, 32, 44, 0.6)");
    const glassBorder = useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)");

    return (
        <VStack
            as="aside"
            w="350px"
            display="block"
        >
            <SpecterLogo />

            <Box
                bg={glassBg}
                backdropFilter="blur(12px)"
                border="1px solid"
                borderColor={glassBorder}
                boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
                borderRadius="xl"
                p={6}
                flex={1}
                minH={0}
                display="flex"
                flexDirection="column"
            >
                <CompanyFilters />
            </Box>
        </VStack>
    );
}