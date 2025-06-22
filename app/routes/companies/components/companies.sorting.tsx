import {
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
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

    const toggleSortOrder = () => {
        setFilters({
            ...filters,
            sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
        });
    };

    return (
        <HStack spacing={2}>
            <Text fontSize="sm" variant="subtle" whiteSpace="nowrap">
                Sort by
            </Text>
            <Menu>
                <MenuButton
                    as={Button}
                    size="sm"
                    variant="outline"
                    rightIcon={<FiChevronDown />}
                    bg="white"
                    borderColor="gray.200"
                    _hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
                    _expanded={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
                    _dark={{
                        bg: "gray.700",
                        borderColor: "gray.600"
                    }}
                >
                    {filters.sortBy === 'rank' ? 'Rank' : 'Name'}
                </MenuButton>
                <MenuList
                    bg="white"
                    borderColor="gray.200"
                    minW="100px"
                    _dark={{
                        bg: "gray.700",
                        borderColor: "gray.600"
                    }}
                >
                    <MenuItem
                        onClick={() => setFilters({ ...filters, sortBy: 'rank' })}
                        bg={filters.sortBy === 'rank' ? "blue.50" : "transparent"}
                        _dark={{ bg: filters.sortBy === 'rank' ? "blue.900" : "transparent" }}
                    >
                        Rank
                    </MenuItem>
                    <MenuItem
                        onClick={() => setFilters({ ...filters, sortBy: 'name' })}
                        bg={filters.sortBy === 'name' ? "blue.50" : "transparent"}
                        _dark={{ bg: filters.sortBy === 'name' ? "blue.900" : "transparent" }}
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
                    color="gray.600"
                    _hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
                    onClick={toggleSortOrder}
                    _dark={{ color: "gray.300" }}
                />
            </Tooltip>
        </HStack>
    );
}