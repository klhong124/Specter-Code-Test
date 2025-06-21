import { Box } from "@chakra-ui/react";
import { CompanyFilters } from "./company.filters";
import { useCompaniesContext } from "../context/companies.context";

export function CompaniesSidebar() {
    const { filters, setFilters, filterOptions } = useCompaniesContext();

    return (
        <Box
            display={{ base: "none", lg: "block" }}
            w="300px"
            flexShrink={0}
            bg="white"
            borderRadius="lg"
            shadow="md"
            p={6}
            h="fit-content"
            position="sticky"
            top={8}
        >
            <CompanyFilters
                filters={filters}
                setFilters={setFilters}
                filterOptions={filterOptions}
            />
        </Box>
    );
}