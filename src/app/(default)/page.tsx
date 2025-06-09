import Homepage from '@/features/homepage';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoaderPage from '@/components/utilities/LoaderPage';
import batchedGraphqlRequest from '@/lib/graphql/batchedGraphqlRequest';
import { GET_COUNTRIES, GET_CONTINENTS } from '@/graphql/queries';
import type {
  GetCountriesQuery,
  GetContinentsQuery,
} from '@/graphql/generated-types/graphql';
import { print } from 'graphql';

export const metadata: Metadata = {
  title: 'Next.js Assignment - Home',
  description:
    'A Next.js project with TypeScript, Yarn, and the Youwe Component Library',
};

// Server component that fetches initial data using company's batched approach
async function fetchInitialData() {
  try {
    // Use batched requests for critical rendering data as per company policy
    // Both queries are critical for initial page render, so we use 'critical' queue
    const [countriesResult, continentsResult] = await Promise.allSettled([
      batchedGraphqlRequest<GetCountriesQuery>(
        print(GET_COUNTRIES), // Convert DocumentNode to string
        {},
        'critical', // Critical queue for initial page data
      ),
      batchedGraphqlRequest<GetContinentsQuery>(
        print(GET_CONTINENTS), // Convert DocumentNode to string
        {},
        'critical', // Critical queue for initial page data
      ),
    ]);

    return {
      countries:
        countriesResult.status === 'fulfilled' ? countriesResult.value : null,
      continents:
        continentsResult.status === 'fulfilled' ? continentsResult.value : null,
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
  // Fetch initial data on the server using company's batched approach
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
