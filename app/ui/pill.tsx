import { Button, HStack, Icon, Text, Badge, Tag, TagLabel, TagCloseButton, Center } from "@chakra-ui/react";
import { AddIcon, CheckIcon } from "@chakra-ui/icons";
import { AnimatePresence, motion } from "framer-motion";

interface PillProps {
    value: string;
    label: string;
    isSelected?: boolean;
    onChange?: (value: string) => void;
    variant?: 'readonly' | 'removable' | 'checkbox';
    colorScheme?: string;
}

export function Pill({
    value,
    label,
    isSelected = false,
    onChange = () => { },
    variant = 'readonly',
    colorScheme = 'brand',
}: PillProps) {

    const iconVariants = {
        hidden: { y: -10, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: 10, opacity: 0 },
    };

    const commonStyles = {
        size: "xs",
        rounded: "full",
        borderWidth: "1px",
        display: "flex",
        alignItems: "center",
    };

    const selectedStyles = {
        bg: "brand.50",
        color: "brand.600",
        borderColor: "brand.200",
        _hover: { bg: "brand.100" },
        _dark: {
            bg: "brand.900",
            color: "brand.200",
            borderColor: "brand.700",
            _hover: { bg: "brand.800" },
        },
    };

    const unselectedStyles = {
        bg: "transparent",
        color: "gray.600",
        borderColor: "gray.200",
        _hover: { bg: "gray.50" },
        _dark: {
            bg: "transparent",
            color: "gray.400",
            borderColor: "gray.700",
            _hover: { bg: "gray.800" },
        },
    };

    if (variant === 'checkbox') {
        return (
            <Button
                as={motion.button}
                onClick={() => onChange(value)}
                {...commonStyles}
                {...(isSelected ? selectedStyles : unselectedStyles)}
            >
                <HStack gap={2} align="center">
                    <Text as="span" fontSize="xs" color="inherit" pl={1}>
                        {label}
                    </Text>
                    <AnimatePresence initial={false} mode="wait">
                        <Center
                            as={motion.div}
                            key={isSelected ? "check" : "plus"}
                            variants={iconVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition="0.1s linear"
                        >
                            <Icon as={isSelected ? CheckIcon : AddIcon} boxSize="10px" />
                        </Center>
                    </AnimatePresence>
                </HStack>
            </Button>
        );
    }

    if (variant === 'removable') {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.2, ease: "easeOut" as const },
                }}
                exit={{
                    opacity: 0,
                    scale: 1.2,
                    y: -10,
                    filter: "blur(4px)",
                    transition: { duration: 0.2, ease: "easeOut" as const },
                }}
            >
                <Tag
                    size="md"
                    borderRadius="full"
                    px={2}
                    variant="subtle"
                    colorScheme={colorScheme}
                >
                    <TagLabel fontSize="xs" pl={1}>{label}</TagLabel>
                    <TagCloseButton fontSize="xs" onClick={() => onChange(value)} />
                </Tag>
            </motion.div>
        );
    }

    // Default is 'readonly'
    return (
        <Badge
            colorScheme={colorScheme}
            variant="subtle"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
            textTransform="capitalize"
        >
            {label}
        </Badge>
    );
}