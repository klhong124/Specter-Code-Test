import { Box } from "@chakra-ui/react";
import { CompanyFilters } from "./company.filters";
import type { Filters } from "./company.filters";

interface CompaniesSidebarProps {
    filters: Filters;
    setFilters: (filters: Filters) => void;
    filterOptions: {
        growthStages: string[];
        customerFocuses: string[];
        fundingTypes: string[];
    };
}

export function CompaniesSidebar({ filters, setFilters, filterOptions }: CompaniesSidebarProps) {
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