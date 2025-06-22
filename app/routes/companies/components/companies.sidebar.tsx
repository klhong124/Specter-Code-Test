import { Box, Button, Flex, Image, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router";
import { CompanyFilters } from "./companies.filters";
import { useCompaniesContext } from "../context/companies.context";
import { HiArrowLeft } from "react-icons/hi";

export function CompaniesSidebar() {
    const { filters, setFilters, filterOptions } = useCompaniesContext();

    const glassBg = useColorModeValue("rgba(255, 255, 255, 0.6)", "rgba(26, 32, 44, 0.6)");
    const glassBorder = useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)");

    return (
        <Flex
            display={{ base: "none", lg: "block" }}
            flexDirection="column"
            position="sticky"
            top="2rem"
            h="calc(100vh - 4rem)"
        >

            <Button
                variant="ghost"
                as={Link}
                to="/"
                mb={8}
                _hover={{
                    bg: "transparent",
                }}
            >
                <Image src="/specter.svg" alt="Specter" h={8} />
            </Button>

            <Box
                w="300px"
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