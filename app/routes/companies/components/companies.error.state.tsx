import { VStack, Box, Text } from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";

export function CompaniesErrorState() {
    return (
        <Box textAlign="center" py={12} className="glass">
            <VStack spacing={4}>
                <WarningTwoIcon color="gray.400" boxSize={6} />

                <Text variant="muted" fontSize="sm">
                    Failed to load companies. Please try again later.
                </Text>
            </VStack>
        </Box>
    );
}