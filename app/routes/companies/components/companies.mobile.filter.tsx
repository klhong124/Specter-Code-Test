import { Box, IconButton } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiFilter } from "react-icons/fi";

interface CompaniesMobileFilterProps {
    onOpen: () => void;
}

export function CompaniesMobileFilter({ onOpen }: CompaniesMobileFilterProps) {
    return (
        <Box display={{ base: "block", lg: "none" }} position="fixed" top={4} left={4} zIndex={10}>
            <IconButton
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open filters"
                icon={<FiFilter />}
                onClick={onOpen}
                colorScheme="brand"
                size="lg"
                shadow="lg"
            />
        </Box>
    );
}