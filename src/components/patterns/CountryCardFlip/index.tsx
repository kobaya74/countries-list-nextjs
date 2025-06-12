'use client';

import { Typography } from '@youwe/component-library';
import LoaderComponent from '@/components/utilities/LoaderComponent';
import { type ApolloError } from '@apollo/client';

interface CountryCardFlipProps {
  country: {
    emoji: string;
    name: string;
    capital?: string | null;
    currency?: string | null;
    continent: {
      name: string;
    };
  };
  detailsLoading: boolean;
  detailsError?: ApolloError;
  detailsData?: {
    country?: {
      phone?: string;
      languages?: Array<{
        code: string;
        name: string;
      }>;
      states?: Array<{
        name: string;
      }>;
    } | null;
  };
  isDetailsFetched: boolean;
  renderDetailErrors: () => React.ReactNode;
}

export default function CountryCardFlip({
  country,
  detailsLoading,
  detailsError,
  detailsData,
  isDetailsFetched,
  renderDetailErrors,
}: CountryCardFlipProps) {
  return (
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
            {detailsError.graphQLErrors?.length
              ? detailsError.graphQLErrors[0].message
              : 'Please try again later.'}
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

      <Typography as='div' size='md' className='mt-3 text-center font-medium'>
        Click to go back
      </Typography>
    </div>
  );
}
