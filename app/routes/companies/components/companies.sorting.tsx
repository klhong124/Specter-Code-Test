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
import { ArrowUpIcon, ArrowDownIcon, ChevronDownIcon } from "@chakra-ui/icons";
import type { CompaniesQuery } from "@companies/types/company.type";

const SORTS: { value: CompaniesQuery['sortBy']; label: string }[] = [
    { value: 'rank', label: 'Rank' },
    { value: 'name', label: 'Name' },
    { value: 'last_funding_amount', label: 'Last Funding' },
];

export function CompaniesSorting() {
    const { query, setQuery } = useCompaniesContext();

    const toggleSortOrder = () => {
        setQuery({
            ...query,
            sortOrder: query.sortOrder === 'asc' ? 'desc' : 'asc'
        });
    };

    return (
        <HStack spacing={1}>
            <Menu>
                <MenuButton
                    as={Button}
                    size="sm"
                    variant="outline"
                    rightIcon={<ChevronDownIcon />}
                    bg="white"
                    borderColor="gray.200"
                    _hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
                    _expanded={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
                    _dark={{
                        bg: "gray.700",
                        borderColor: "gray.600"
                    }}
                >
                    {SORTS.find(s => s.value === query.sortBy)?.label}
                </MenuButton>
                <MenuList
                    bg="white"
                    borderColor="gray.200"
                    minW="120px"
                    _dark={{
                        bg: "gray.700",
                        borderColor: "gray.600"
                    }}
                >
                    {SORTS.map(sort => (
                        <MenuItem
                            key={sort.value}

                            onClick={() => setQuery({ ...query, sortBy: sort.value })}
                            bg={query.sortBy === sort.value ? "blue.50" : "transparent"}
                            _dark={{ bg: query.sortBy === sort.value ? "blue.900" : "transparent" }}
                        >
                            <Text fontSize="sm">
                                {sort.label}
                            </Text>
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>

            <Tooltip label={`Sort ${query.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}>
                <IconButton
                    aria-label={`Sort ${query.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                    icon={query.sortOrder === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    size="md"
                    variant="ghost"
                    _hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
                    onClick={toggleSortOrder}
                    _dark={{ color: "gray.300" }}
                />
            </Tooltip>
        </HStack>
    );
}