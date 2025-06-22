import { Box, Button, Flex, Image, useColorMode, VStack } from "@chakra-ui/react";
import { Link } from "react-router";
import { CompanyFilters } from "./companies.filters";
import { FiMoon, FiSun } from "react-icons/fi";
import { memo } from "react";

const SpecterLogo = memo(function SpecterLogo() {
    const { colorMode, toggleColorMode } = useColorMode();

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
                <Image src="/specter.svg" alt="Specter" h={8} filter="none" _dark={{ filter: "brightness(0) invert(1)" }} />
            </Button>
            <Button onClick={toggleColorMode} variant="ghost" size="sm">
                {colorMode === 'light' ? <FiMoon /> : <FiSun />}
            </Button>
        </Flex>
    );
});

export function CompaniesSidebar() {
    return (
        <VStack
            as="aside"
            w="350px"
            display="block"
        >
            <SpecterLogo />

            <Box
                className="glass"
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