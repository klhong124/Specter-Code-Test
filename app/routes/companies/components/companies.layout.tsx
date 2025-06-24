import { Box, Container, HStack, VStack } from "@chakra-ui/react";
import { forwardRef } from "react";
import type { ReactNode, RefObject } from "react";
import { CompaniesSidebar } from './companies.sidebar';
import { CompaniesHeader } from './companies.header';

interface CompaniesLayoutProps {
    children: ReactNode;
    headerHeight: number;
    headerRef: RefObject<HTMLDivElement | null>;
    onOpen: () => void;
}

export const CompaniesLayout = forwardRef<HTMLDivElement, CompaniesLayoutProps>(
    ({ children, headerHeight, headerRef, onOpen }, ref) => {
        return (
            <Box
                minH="100dvh"
                bgImage="url(bg.png)"
                bgSize="cover"
                bgPosition="top"
                bgRepeat="no-repeat"
                bgAttachment="fixed"
                pos="relative"
                zIndex={0}
                _before={{
                    content: '""',
                    pos: "absolute",
                    backdropFilter: "blur(1px)",
                    inset: 0,
                    bgColor: "rgba(255, 255, 255, 0.6)",
                    zIndex: -1,
                }}
                _dark={{
                    _before: {
                        bgColor: "rgba(0, 0, 0, 0.7)",
                    }
                }}
            >
                <Container maxW="container.xl">
                    <HStack spacing={8} align="start">
                        {/* Desktop Side Panel */}
                        <Box
                            position="sticky"
                            top="0"
                            h="100dvh"
                            display={{ base: "none", lg: "block" }}
                        >
                            <CompaniesSidebar />
                        </Box>

                        {/* Main Section */}
                        <VStack spacing={0} flex={1} align="stretch" position="relative">
                            {/* Header */}
                            <CompaniesHeader ref={headerRef} onOpen={onOpen} />

                            {/* Main Content Area */}
                            <Box
                                pt={`${headerHeight + 64}px`}
                                overflowY="scroll"
                                overflowX="hidden"
                                h="100dvh"
                                px={4}
                            >
                                {children}
                            </Box>
                        </VStack>
                    </HStack>
                </Container>
            </Box>
        );
    }
);

CompaniesLayout.displayName = 'CompaniesLayout';