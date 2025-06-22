import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { Link } from "react-router";
import { CompanyFilters } from "./companies.filters";
import { useCompaniesContext } from "../context/companies.context";
import { HiArrowLeft } from "react-icons/hi";

export function CompaniesSidebar() {
    const { filters, setFilters, filterOptions } = useCompaniesContext();

    return (
        <Flex
            display={{ base: "none", lg: "block" }}
            flexDirection="column"
            position="sticky"
            h="fit-content"
            top={8}
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
                bg="white"
                borderRadius="lg"
                shadow="md"
                p={6}

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