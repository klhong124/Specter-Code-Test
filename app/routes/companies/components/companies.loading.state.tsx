import { Container, Box, VStack, Spinner, Text } from "@chakra-ui/react";

export function CompaniesLoadingState() {
    return (
        <Container maxW="container.xl" py={8}>
            <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
                <VStack spacing={4}>
                    <Spinner size="xl" color="blue.500" />
                    <Text>Loading companies...</Text>
                </VStack>
            </Box>
        </Container>
    );
}