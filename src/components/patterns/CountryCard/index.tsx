'use client';

import {
  type GetCountriesQuery,
  type GetCountryDetailsQuery,
} from '@/graphql/generated-types/graphql';
import { useState } from 'react';
import { useGraphqlLazyQuery } from '@/hooks/useGraphqlLazyQuery';
import { useGraphqlMutation } from '@/hooks/useGraphqlMutation';
import { GET_COUNTRY_DETAILS } from '@/graphql/queries';
import { TRACK_COUNTRY_VIEW } from '@/graphql/mutations';
import LoaderComponent from '@/components/utilities/LoaderComponent';
import { Typography } from '@youwe/component-library';
import { hasErrorMessage } from '@/types/errors';

type CountryCardProps = {
  country: GetCountriesQuery['countries'][0];
};

interface TrackCountryViewResponse {
  trackCountryView: {
    success: boolean;
    message: string;
  };
}

export default function CountryCard({ country }: CountryCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDetailsFetched, setIsDetailsFetched] = useState(false);

  // Use our custom Apollo-like lazy query hook with company's single GraphQL requests
  const [
    fetchDetails,
    { loading: detailsLoading, error: detailsError, data: detailsData },
  ] = useGraphqlLazyQuery<GetCountryDetailsQuery>(GET_COUNTRY_DETAILS, {
    errorPolicy: 'all', // Show partial data even if some fields fail
    next: {
      revalidate: 3600, // Cache for 1 hour using Next.js fetch options
      tags: [`country-details-${country.code}`],
    },
  });

  // Use our custom Apollo-like mutation hook for tracking
  const [trackCountryView] = useGraphqlMutation<TrackCountryViewResponse>(
    TRACK_COUNTRY_VIEW,
    {
      errorPolicy: 'none', // Don't show user-facing errors for tracking failures
    },
  );

  const handleFlip = () => {
    const newState = !isFlipped;
    setIsFlipped(newState);

    // Only fetch details if flipping to show details and we haven't fetched them yet
    if (newState && !isDetailsFetched) {
      fetchDetails({
        variables: { code: country.code },
        errorPolicy: 'all', // Show partial data even if some fields fail
      });
      setIsDetailsFetched(true); // Mark as fetched regardless of success/failure
    }

    // Track the flip action (non-blocking)
    trackCountryView({
      variables: {
        countryCode: country.code,
        action: newState ? 'view_details' : 'view_summary',
      },
    });
  };

  const renderDetailErrors = () => {
    if (!detailsError) return null;

    // Extract error message safely
    const errorMessage =
      typeof detailsError === 'string'
        ? detailsError
        : hasErrorMessage(detailsError)
          ? detailsError.message
          : 'An error occurred while loading details';

    return (
      <div className='rounded mb-2 p-2'>
        <Typography as='span' size='md' className='mb-2 font-bold'>
          ⚠️ Some details unavailable:
        </Typography>
        <p className='mt-1 text-xs'>{errorMessage}</p>
      </div>
    );
  };

  return (
    <div
      className='h-64 cursor-pointer [perspective:1000px]'
      onClick={handleFlip}
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* Front of card - Basic info */}
        <div className='bg-white absolute h-full w-full rounded-lg border p-4 shadow-sm [backface-visibility:hidden]'>
          <div className='mb-4 flex items-center gap-2'>
            <span>{country.emoji}</span>
            <Typography as='h3' size='sm' className='font-semibold'>
              {country.name}
            </Typography>
          </div>
          <div className='text-sm'>
            <Typography as='p' size='md' className='font-medium'>
              Capital: {country.capital || 'N/A'}
            </Typography>
            <Typography as='p' size='md' className='font-medium'>
              Currency: {country.currency || 'N/A'}
            </Typography>
            <Typography as='p' size='md' className='font-medium'>
              Continent: {country.continent.name}
            </Typography>
          </div>
          <Typography
            as='div'
            size='md'
            className='mt-6 text-center font-medium'
          >
            Click for more details
          </Typography>
        </div>

        {/* Back of card - Detailed info */}
        <div className='absolute h-full w-full rounded-lg border p-4 shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]'>
          <div className='mb-3 flex items-center gap-2'>
            <span className='text-3xl'>{country.emoji}</span>
            <Typography as='h3' size='xs' className='font-semibold'>
              {country.name}
            </Typography>
          </div>

          {detailsLoading && (
            <div className='flex h-32 items-center justify-center'>
              <LoaderComponent
                loaderType='spinner'
                loaderVariant='secondary'
                loaderSize='lg'
              />
            </div>
          )}

          {detailsError && !detailsData && (
            <div className='text-xs'>
              <Typography as='div' size='md' className='mb-2 font-bold'>
                Unable to load detailed information
              </Typography>
              <p className='text-xs'>
                {typeof detailsError === 'string'
                  ? detailsError
                  : hasErrorMessage(detailsError)
                    ? detailsError.message
                    : 'An error occurred while loading details'}
              </p>
            </div>
          )}

          {!detailsLoading &&
            (detailsData || (detailsError && isDetailsFetched)) && (
              <div className='max-h-36 overflow-y-auto text-sm'>
                {renderDetailErrors()}

                <div className='mb-2'>
                  <Typography as='p' size='sm' className='font-medium'>
                    Capital: {country.capital || 'N/A'}
                  </Typography>
                  <Typography as='p' size='sm' className='font-medium'>
                    Currency: {country.currency || 'N/A'}
                  </Typography>
                  <Typography as='p' size='sm' className='font-medium'>
                    Continent: {country.continent.name}
                  </Typography>
                  <Typography as='p' size='sm' className='font-medium'>
                    Phone: {detailsData?.country?.phone || 'N/A'}
                  </Typography>
                </div>

                {detailsData?.country?.languages &&
                  detailsData.country.languages.length > 0 && (
                    <div className='mb-2'>
                      <Typography as='p' size='sm' className='font-medium'>
                        Languages:
                      </Typography>
                      <ul className='ml-4 list-disc'>
                        {detailsData.country.languages.map(lang => (
                          <li key={lang.code}>{lang.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {detailsData?.country?.states &&
                  detailsData.country.states.length > 0 && (
                    <div>
                      <p className='font-medium'>States:</p>
                      <p className='text-xs'>
                        {detailsData.country.states
                          .map(state => state.name)
                          .join(', ')}
                      </p>
                    </div>
                  )}
              </div>
            )}

          <Typography
            as='div'
            size='md'
            className='mt-3 text-center font-medium'
          >
            Click to go back
          </Typography>
        </div>
      </div>
    </div>
  );
}
