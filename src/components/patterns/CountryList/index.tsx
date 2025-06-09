import { type GetCountriesQuery } from '@/graphql/generated-types/graphql';
import { type ApolloError } from '@apollo/client';
import CountryCard from '@/components/patterns/CountryCard';
import { Pagination, Typography } from '@youwe/component-library';
import LoaderComponent from '@/components/utilities/LoaderComponent';

interface CountryListProps {
  countries?: GetCountriesQuery['countries'];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  error?: ApolloError;
  // eslint-disable-next-line no-unused-vars
  onPageChange(page: number): void;
}

export default function CountryList({
  countries,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  error,
}: CountryListProps) {
  if (loading) {
    return (
      <LoaderComponent
        loaderType='dots'
        loaderVariant='secondary'
        loaderSize='lg'
        loaderText='Loading countries...'
      />
    );
  }

  // Show error only when we have no data at all
  if (!countries?.length) {
    if (error) {
      return (
        <div className='text-center'>
          <div className='text-red-500 mb-4'>
            <Typography as='h3' size='md' className='font-semibold mb-2'>
              Unable to load countries
            </Typography>
            <Typography as='p' size='sm'>
              {error.graphQLErrors?.length
                ? error.graphQLErrors.map(err => err.message).join(', ')
                : 'An unexpected error occurred. Please try again later.'}
            </Typography>
          </div>
        </div>
      );
    }
    return (
      <Typography as='div' size='md' className='text-center'>
        No countries found
      </Typography>
    );
  }

  const startIndex = (currentPage - 1) * 12 + 1;
  const endIndex = Math.min(startIndex + countries.length - 1, totalCount || 0);

  return (
    <div className='flex flex-col gap-6'>
      {/* GraphQL Error Warning for partial data */}
      {error?.graphQLErrors?.length && (
        <div className='rounded-lg border p-3'>
          <div className='text-sm'>
            <Typography as='span' size='md' className='mb-2 font-bold'>
              ⚠️ Data Warning: Some country information may be incomplete.
            </Typography>
          </div>
        </div>
      )}

      {/* Results counter */}
      {totalCount && totalCount > 0 && (
        <div className='flex flex-col items-center justify-between tablet-portrait:flex-row'>
          <Typography size='sm' className='py-4'>
            Showing {startIndex}-{endIndex} of {totalCount} countries
          </Typography>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex flex-1 justify-end'>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={onPageChange}
              />
            </div>
          )}
        </div>
      )}

      {/* Countries grid */}
      <div className='grid grid-cols-1 gap-4 tablet-portrait:grid-cols-2 tablet-landscape:grid-cols-3 desktop:grid-cols-4'>
        {countries.map(country => (
          <CountryCard key={country.code} country={country} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='mt-8 flex justify-center'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
