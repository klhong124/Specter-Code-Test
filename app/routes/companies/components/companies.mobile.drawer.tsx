import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from "@chakra-ui/react";
import { CompanyFilters } from "./companies.filters";

interface CompaniesMobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CompaniesMobileDrawer({ isOpen, onClose }: CompaniesMobileDrawerProps) {
    return (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Filters</DrawerHeader>
                <DrawerBody>
                    <CompanyFilters />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}