'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/search/search-bar';
import { SearchResults } from '@/components/search/search-results';
import { SearchFilters } from '@/components/search/search-filters';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState({
    query: '',
    type: 'all',
    tags: [] as string[],
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Search</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <SearchFilters
            filters={searchParams}
            onChange={(filters) => setSearchParams(filters)}
          />
        </div>
        
        <div className="md:col-span-3">
          <SearchBar
            value={searchParams.query}
            onChange={(query) => setSearchParams({ ...searchParams, query })}
          />
          <SearchResults searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
}