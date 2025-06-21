import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from "@chakra-ui/react";
import { CompanyFilters } from "./company.filters";
import type { Filters } from "./company.filters";

interface CompaniesMobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    filters: Filters;
    setFilters: (filters: Filters) => void;
    filterOptions: {
        growthStages: string[];
        customerFocuses: string[];
        fundingTypes: string[];
    };
}

export function CompaniesMobileDrawer({
    isOpen,
    onClose,
    filters,
    setFilters,
    filterOptions
}: CompaniesMobileDrawerProps) {
    return (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px">Filters</DrawerHeader>
                <DrawerBody p={6}>
                    <CompanyFilters
                        filters={filters}
                        setFilters={setFilters}
                        filterOptions={filterOptions}
                    />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}