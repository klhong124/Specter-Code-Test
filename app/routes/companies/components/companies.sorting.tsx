import {
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useColorModeValue,
    Tooltip,
    Button,
    Text,
} from "@chakra-ui/react";
import { useCompaniesContext } from "@companies/context/companies.context";
import { FiTrendingUp, FiTrendingDown, FiChevronDown } from "react-icons/fi";
import type { Filters } from "@companies/types/companies.filters.type";

const SORTS: { value: Filters['sortBy']; label: string }[] = [
    { value: 'rank', label: 'Rank' },
    { value: 'name', label: 'Name' },
];

export function CompaniesSorting() {
    const { filters, setFilters } = useCompaniesContext();

    const iconColor = useColorModeValue("gray.600", "gray.300");
    const hoverBg = useColorModeValue("gray.100", "gray.700");
    const menuBg = useColorModeValue("white", "gray.700");
    const menuBorderColor = useColorModeValue("gray.200", "gray.600");

    const toggleSortOrder = () => {
        setFilters({
            ...filters,
            sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
        });
    };

    return (
        <HStack spacing={2}>
            <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")} whiteSpace="nowrap">
                Sort by
            </Text>
            <Menu>
                <MenuButton
                    as={Button}
                    size="sm"
                    variant="outline"
                    rightIcon={<FiChevronDown />}
                    bg={useColorModeValue("white", "gray.700")}
                    borderColor={menuBorderColor}
                    _hover={{ bg: hoverBg }}
                    _expanded={{ bg: hoverBg }}
                >
                    {filters.sortBy === 'rank' ? 'Rank' : 'Name'}
                </MenuButton>
                <MenuList bg={menuBg} borderColor={menuBorderColor} minW="100px">
                    <MenuItem
                        onClick={() => setFilters({ ...filters, sortBy: 'rank' })}
                        bg={filters.sortBy === 'rank' ? useColorModeValue("blue.50", "blue.900") : "transparent"}
                    >
                        Rank
                    </MenuItem>
                    <MenuItem
                        onClick={() => setFilters({ ...filters, sortBy: 'name' })}
                        bg={filters.sortBy === 'name' ? useColorModeValue("blue.50", "blue.900") : "transparent"}
                    >
                        Name
                    </MenuItem>
                </MenuList>
            </Menu>

            <Tooltip label={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}>
                <IconButton
                    aria-label={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                    icon={filters.sortOrder === 'asc' ? <FiTrendingUp /> : <FiTrendingDown />}
                    size="sm"
                    variant="ghost"
                    color={iconColor}
                    _hover={{ bg: hoverBg }}
                    onClick={toggleSortOrder}
                />
            </Tooltip>
        </HStack>
    );
}