import { Container, Alert, AlertIcon } from "@chakra-ui/react";

export function CompaniesErrorState() {
    return (
        <Container maxW="container.xl" py={8}>
            <Alert status="error">
                <AlertIcon />
                Failed to load companies. Please try again later.
            </Alert>
        </Container>
    );
}