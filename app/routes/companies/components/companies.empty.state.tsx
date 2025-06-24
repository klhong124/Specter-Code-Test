import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useCompaniesContext } from "@companies/context/companies.context";
import { motion } from "framer-motion";

export function CompaniesEmptyState() {
    const { clearQuery } = useCompaniesContext();

    return (
        <Box textAlign="center" py={12} className="glass">
            <VStack spacing={4}>
                <SearchIcon color="gray.400" boxSize={6} />

                <Text variant="muted" fontSize="sm">
                    No companies found matching your criteria.
                </Text>
                <Button
                    as={motion.button}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition="0.2s linear"
                    size="sm"
                    colorScheme="orange"
                    variant="outline"
                    onClick={clearQuery}
                >
                    Clear Filter
                </Button>
            </VStack>
        </Box>
    );
}