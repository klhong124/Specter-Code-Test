import { Button } from "@chakra-ui/react";
import { FunnelIcon } from "@chakra-ui/icons";

interface CompaniesMobileFilterProps {
    onOpen: () => void;
}

export function CompaniesMobileFilter({ onOpen }: CompaniesMobileFilterProps) {
    return (
        <Button
            variant="outline"
            px={4}
            onClick={onOpen}
            display={{ base: "flex", lg: "none" }}
            leftIcon={<FunnelIcon />}
        >
            Filters
        </Button>
    );
}