'use client';

import { type GetContinentsQuery } from '@/graphql/generated-types/graphql';
import { type ApolloError } from '@apollo/client';
import { Button, Typography } from '@youwe/component-library';
import LoaderComponent from '@/components/utilities/LoaderComponent';
import { useState } from 'react';

interface CountryFilterProps {
  continents?: GetContinentsQuery['continents'];
  selectedContinent: string | null;
  searchTerm: string;
  loading?: boolean;
  error?: ApolloError;
  // eslint-disable-next-line no-unused-vars
  onContinentChange(continent: string | null): void;
  // eslint-disable-next-line no-unused-vars
  onSearch(searchTerm: string): void;
}

function FiltersTitle() {
  return (
    <div className='mb-4'>
      <Typography as='h2' size='md' className='mb-2 font-bold'>
        Filter Countries
      </Typography>
    </div>
  );
}

export default function CountryFilter({
  continents,
  selectedContinent,
  searchTerm,
  loading,
  error,
  onContinentChange,
  onSearch,
}: CountryFilterProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearch = () => {
    onSearch(localSearchTerm.trim());
  };

  const handleReset = () => {
    setLocalSearchTerm('');
    onSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className='mb-2'>
        <FiltersTitle />
        <LoaderComponent
          loaderType='spinner'
          loaderVariant='secondary'
          loaderSize='lg'
          loaderText='Loading filters...'
        />
      </div>
    );
  }

  if (error && !continents) {
    return (
      <div className='mb-2'>
        <FiltersTitle />
        <Typography as='div' size='md' className='mb-2 font-bold'>
          Unable to load continent filters.
        </Typography>
      </div>
    );
  }

  return (
    <div className='mb-6'>
      <FiltersTitle />

      {/* Search by name */}
      <div className='mb-4'>
        <Typography as='h3' size='sm' className='mb-2 font-medium'>
          Search by Name
        </Typography>
        <div className='flex'>
          <div className='relative max-w-[300px] flex-1'>
            <input
              id='country-search'
              type='text'
              placeholder='Enter country name...'
              value={localSearchTerm}
              onChange={e => setLocalSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className='border-gray-300 w-full rounded-sm border px-3 py-2 pr-10 text-sm text-[#151515] focus:outline-none focus:ring-1'
            />
            {localSearchTerm && (
              <button
                type='button'
                onClick={handleReset}
                className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#151515] focus:outline-none focus:ring-2'
                aria-label='Clear search'
              >
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            )}
          </div>
          <Button
            onClick={handleSearch}
            className='min-h-[40px]'
            size='md'
            variant='neutral'
          >
            Search
          </Button>
        </div>
      </div>

      {/* Filter by continent */}
      <div>
        <Typography as='h3' size='sm' className='mb-2 font-medium'>
          Filter by Continent
        </Typography>
        {error?.graphQLErrors?.length && (
          <Typography as='div' size='sm' className='mb-2'>
            ⚠️ Some continent data may be incomplete
          </Typography>
        )}
        <div className='flex flex-wrap gap-2'>
          <Button
            className={`rounded border-transparent bg-transparent px-4 py-2 underline-offset-4 hover:bg-transparent hover:underline focus:bg-transparent active:bg-transparent ${!selectedContinent && 'underline'}`}
            onClick={() => onContinentChange(null)}
          >
            All
          </Button>
          {continents?.map(continent => (
            <Button
              key={continent.code}
              className={`rounded border-transparent bg-transparent px-4 py-2 underline-offset-4 hover:bg-transparent hover:underline focus:bg-transparent active:bg-transparent ${selectedContinent === continent.name && 'underline'}`}
              onClick={() => onContinentChange(continent.name)}
            >
              {continent.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
