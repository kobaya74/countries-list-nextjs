'use client';

import {
  type GetCountriesQuery,
  useGetCountryDetailsLazyQuery,
} from '@/graphql/generated-types/graphql';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { TRACK_COUNTRY_VIEW } from '@/graphql/mutations/index';
import { Typography } from '@youwe/component-library';
import CountryCardFlip from '@/components/patterns/CountryCardFlip';

type CountryCardProps = {
  country: GetCountriesQuery['countries'][0];
};

export default function CountryCard({ country }: CountryCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDetailsFetched, setIsDetailsFetched] = useState(false);

  // Query for fetching detailed data with enhanced error handling
  const [
    fetchDetails,
    { loading: detailsLoading, error: detailsError, data: detailsData },
  ] = useGetCountryDetailsLazyQuery({
    errorPolicy: 'all', // Show partial data even if some fields fail
  });

  // Tracking mutation with enhanced error handling
  const [trackCountryView] = useMutation(TRACK_COUNTRY_VIEW, {
    errorPolicy: 'all', // Continue even if tracking fails
    onError: error => {
      console.error('Tracking error:', error);
      // Don't show user-facing error for tracking failures
    },
  });

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
    if (!detailsError?.graphQLErrors?.length) return null;

    return (
      <div className='rounded mb-2 p-2'>
        <Typography as='span' size='md' className='mb-2 font-bold'>
          ⚠️ Some details unavailable:
        </Typography>
        <ul className='mt-1 list-inside list-disc'>
          {detailsError.graphQLErrors.map((error, i) => (
            <li key={i}>{error.message}</li>
          ))}
        </ul>
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
        <div className='absolute h-full w-full rounded-lg border p-4 [backface-visibility:hidden]'>
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
        <CountryCardFlip
          country={country}
          detailsLoading={detailsLoading}
          detailsError={detailsError}
          detailsData={detailsData}
          isDetailsFetched={isDetailsFetched}
          renderDetailErrors={renderDetailErrors}
        />
      </div>
    </div>
  );
}
