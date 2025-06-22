import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from "@chakra-ui/react";
import { CompanyFilters } from "./companies.filters";
import { useCompaniesContext } from "../context/companies.context";

interface CompaniesMobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CompaniesMobileDrawer({ isOpen, onClose }: CompaniesMobileDrawerProps) {
    const { filters, setFilters, filterOptions } = useCompaniesContext();

    return (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Filters</DrawerHeader>
                <DrawerBody>
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