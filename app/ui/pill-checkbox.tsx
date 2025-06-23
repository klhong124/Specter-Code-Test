import { Button, HStack, Icon, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiPlus, FiX } from "react-icons/fi";

interface PillCheckboxProps {
    value: string;
    label: string;
    isSelected: boolean;
    onChange: (value: string) => void;
    variant?: 'default' | 'removable';
}

export function PillCheckbox({
    value,
    label,
    isSelected,
    onChange,
    variant = 'default',
}: PillCheckboxProps) {


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
                <Button
                    as={motion.button}
                    onClick={() => onChange(value)}
                    {...commonStyles}
                    {...selectedStyles}
                    rightIcon={<Icon as={FiX} boxSize="12px" />}
                    whileTap={{ scale: 0.95 }}
                >
                    <Text as="span" fontSize="xs" color="inherit" pl={1}>
                        {label}
                    </Text>
                </Button>
            </motion.div>
        );
    }

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
                    <motion.div
                        key={isSelected ? "check" : "plus"}
                        variants={iconVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.1 }}
                    >
                        <Icon as={isSelected ? FiCheck : FiPlus} boxSize="12px" />
                    </motion.div>
                </AnimatePresence>
            </HStack>

        </Button>
    );
}