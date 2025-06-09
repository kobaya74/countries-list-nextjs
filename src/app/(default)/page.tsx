import Homepage from '@/features/homepage';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoaderPage from '@/components/utilities/LoaderPage';
import { getServerApolloClient } from '@/lib/apollo-server';
import { GET_COUNTRIES, GET_CONTINENTS } from '@/graphql/queries';
import type {
  GetCountriesQuery,
  GetContinentsQuery,
} from '@/graphql/generated-types/graphql';

export const metadata: Metadata = {
  title: 'Next.js Assignment - Home',
  description:
    'A Next.js project with TypeScript, Yarn, and the Youwe Component Library',
};

// Server component that fetches initial data
async function fetchInitialData() {
  const client = getServerApolloClient();

  try {
    // Fetch both countries and continents in parallel
    const [countriesResult, continentsResult] = await Promise.allSettled([
      client.query<GetCountriesQuery>({
        query: GET_COUNTRIES,
        errorPolicy: 'all',
      }),
      client.query<GetContinentsQuery>({
        query: GET_CONTINENTS,
        errorPolicy: 'all',
      }),
    ]);

    return {
      countries:
        countriesResult.status === 'fulfilled'
          ? countriesResult.value.data
          : null,
      continents:
        continentsResult.status === 'fulfilled'
          ? continentsResult.value.data
          : null,
      countriesError:
        countriesResult.status === 'rejected' ? countriesResult.reason : null,
      continentsError:
        continentsResult.status === 'rejected' ? continentsResult.reason : null,
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return {
      countries: null,
      continents: null,
      countriesError: error,
      continentsError: error,
    };
  }
}

export default async function Home() {
  // Fetch initial data on the server
  const initialData = await fetchInitialData();

  return (
    <Suspense
      fallback={<LoaderPage loaderType='spinner' loaderVariant='secondary' />}
    >
      <Homepage
        initialCountries={initialData.countries}
        initialContinents={initialData.continents}
        initialCountriesError={initialData.countriesError}
        initialContinentsError={initialData.continentsError}
      />
    </Suspense>
  );
}
