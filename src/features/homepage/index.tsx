'use client';

import { useState, useMemo } from 'react';
import {
  useGetCountriesQuery,
  useGetContinentsQuery,
  type GetCountriesQuery,
  type GetContinentsQuery,
} from '@/graphql/generated-types/graphql';
import CountryFilter from '@/components/patterns/CountryFilter';
import CountryList from '@/components/patterns/CountryList';
import { Typography } from '@youwe/component-library';

const ITEMS_PER_PAGE = 12;

interface HomepageProps {
  initialCountries?: GetCountriesQuery | null;
  initialContinents?: GetContinentsQuery | null;
  initialCountriesError?: any;
  initialContinentsError?: any;
}

export default function Homepage({
  initialCountries,
  initialContinents,
  initialCountriesError,
  initialContinentsError,
}: HomepageProps) {
  const [selectedContinent, setSelectedContinent] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Use Apollo queries with initial data from server
  const {
    loading: continentsLoading,
    error: continentsError,
    data: continentsData,
  } = useGetContinentsQuery({
    errorPolicy: 'all',
    // If we have initial data, use it and skip the initial network request
    skip: !!initialContinents,
  });

  const {
    loading: countriesLoading,
    error: countriesError,
    data: countriesData,
  } = useGetCountriesQuery({
    errorPolicy: 'all',
    // If we have initial data, use it and skip the initial network request
    skip: !!initialCountries,
  });

  // Use server data if available, otherwise fall back to client data
  const effectiveContinentsData = initialContinents || continentsData;
  const effectiveCountriesData = initialCountries || countriesData;
  const effectiveContinentsError = initialContinentsError || continentsError;
  const effectiveCountriesError = initialCountriesError || countriesError;
  const effectiveContinentsLoading = !initialContinents && continentsLoading;
  const effectiveCountriesLoading = !initialCountries && countriesLoading;

  // Client-side filtering
  const filteredCountries = useMemo(() => {
    let filtered = effectiveCountriesData?.countries || [];

    // Filter by search term
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(country =>
        country.name.toLowerCase().includes(searchLower),
      );
    }

    // Filter by continent
    if (selectedContinent) {
      filtered = filtered.filter(
        country => country.continent.name === selectedContinent,
      );
    }

    return filtered;
  }, [effectiveCountriesData?.countries, searchTerm, selectedContinent]);

  const totalPages = Math.ceil(
    (filteredCountries?.length || 0) / ITEMS_PER_PAGE,
  );

  const paginatedCountries = useMemo(() => {
    if (!filteredCountries) return undefined;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCountries.slice(startIndex, endIndex);
  }, [filteredCountries, currentPage]);

  const handleContinentChange = (continent: string | null) => {
    setSelectedContinent(continent);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col items-center justify-center'>
        <Typography as='h2' size='lg' className='font-bold'>
          Countries Explorer
        </Typography>
      </div>

      <div className='mx-auto mb-8 w-full px-4'>
        <CountryFilter
          continents={effectiveContinentsData?.continents}
          selectedContinent={selectedContinent}
          searchTerm={searchTerm}
          onContinentChange={handleContinentChange}
          onSearch={handleSearch}
          loading={effectiveContinentsLoading}
          error={effectiveContinentsError}
        />

        <CountryList
          countries={paginatedCountries}
          loading={effectiveCountriesLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalCount={filteredCountries?.length || 0}
          error={effectiveCountriesError}
        />
      </div>
    </div>
  );
}
