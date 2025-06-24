import { useDisclosure } from "@chakra-ui/react";
import {
    CompaniesFeed,
    CompaniesLayout,
    CompaniesMobileDrawer,
    CompaniesErrorState
} from './components';
import { CompaniesProvider, useCompaniesContext } from './context/companies.context';
import { useInfiniteScroll, useHeaderHeight } from './hooks';
import type { CompaniesApiResponse, CompaniesQuery } from "./types/company.type";
import { loader } from "./utils/companies.loader";
import { generateCompaniesMeta } from "./utils/companies.meta";

// Re-export the loader function
export { loader };

// Export the meta function
export function meta({ data, location }: {
    data: Awaited<ReturnType<typeof loader>>;
    location: { pathname: string; search: string; }
}) {
    return generateCompaniesMeta({ data, location });
}

function CompaniesPageContent() {
    const {
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useCompaniesContext();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { headerRef, headerHeight } = useHeaderHeight();
    const { lastElementRef } = useInfiniteScroll({
        isLoading,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    if (error) {
        return <CompaniesErrorState />;
    }

    return (
        <>
            <CompaniesLayout
                headerHeight={headerHeight}
                headerRef={headerRef}
                onOpen={onOpen}
            >
                <CompaniesFeed
                    lastElementRef={lastElementRef}
                />
            </CompaniesLayout>

            {/* Mobile Drawer */}
            <CompaniesMobileDrawer isOpen={isOpen} onClose={onClose} />
        </>
    );
}

export default function CompaniesPage({ loaderData }: {
    loaderData: {
        initialData: CompaniesApiResponse;
        initialQuery: CompaniesQuery;
    }
}) {
    const { initialData, initialQuery } = loaderData || {};

    return (
        <CompaniesProvider
            initialData={initialData}
            initialQuery={initialQuery}
        >
            <CompaniesPageContent />
        </CompaniesProvider>
    );
}