import { useQuery } from '@apollo/client';
import { gql } from './__generated__';
import CountriesList from './components/CountriesList';
import { useEffect, useState } from 'react';
import CountriesFilter from './components/CountriesFilter';
import { GetCountriesQuery } from './__generated__/graphql';
import styles from './App.module.css';

const GET_COUNTRIES = gql(`
  query GetCountries {
    countries {
      code
      name
      native
      phone
      continent {
        code
        name
      }
      currency
      languages {
        name
      }
      emoji
    }
  }
`);

export type Country = GetCountriesQuery['countries'][number];

export type GroupedData = {
  [key: string]: Country[];
};

type StringValuedKey = 'code' | 'name' | 'native' | 'phone' | 'currency' | 'emoji';

function App() {
  const { data, loading, error: apolloError } = useQuery(GET_COUNTRIES);
  const [filteredAndGroupedData, setFilteredAndGroupedData] =
    useState<GroupedData>();
  const [filterError, setFilterError] = useState('');

  useEffect(() => {
    if (!data) {
      return;
    }
    setFilteredAndGroupedData({ 'All Countries': data?.countries });
  }, [data]);

  const handleFilter = (filterPrompt: string) => {
    if (!data) return;

    setFilterError('');
    const { search, group } = parseFilterPrompt(filterPrompt);
    if (!search && !group) {
      setFilteredAndGroupedData({ 'All Countries': data.countries });
      return;
    }

    if (group && !(group in data.countries[0])) {
      setFilterError(
        `The attribute "${group}" is not present in the country object!`
      );
      return;
    }

    filterAndGroupCountries(search, group);
  };

  const filterAndGroupCountries = (searchTerm: string, groupBy: string) => {
    const filtered = data?.countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.continent.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        country.native.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.languages.some((language) =>
          language.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (country.currency &&
          country.currency.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    if (!filtered) return;

    groupCountries(filtered, groupBy);
  };

  const groupCountries = (filtered: Country[], groupBy: string) => {
    if (!groupBy) {
      setFilteredAndGroupedData({ Countries: filtered });
      return;
    }

    const groupedData = filtered.reduce((acc, country) => {
      if (
        typeof country[groupBy as keyof Country] === 'string' ||
        groupBy === 'currency'
      ) {
        const group = acc[country[groupBy as StringValuedKey] || 'None'] || [];
        group.push(country);
        acc[country[groupBy as StringValuedKey] || 'None'] = group;
      } else if (groupBy === 'continent') { //continent is an object
        const group = acc[country[groupBy].name] || [];
        group.push(country);
        acc[country[groupBy].name] = group;
      } else if (groupBy === 'languages') { //languages is an array
        const languageString =
          country.languages.map((language) => `${language.name}`).toString() ||
          'None';
        const group = acc[languageString] || [];
        group.push(country);
        acc[languageString] = group;
      }
      return acc;
    }, {} as GroupedData);
    setFilteredAndGroupedData(groupedData);
  };

  const parseFilterPrompt = (prompt: string) => {
    const regex = /(search|group)+:(\w+)/gi;

    let match;
    const result = {
      search: '',
      group: '',
    };

    while ((match = regex.exec(prompt)) !== null) {
      const [, key, value] = match;
      if (key.toLowerCase() === 'search') {
        result.search = value;
      }
      if (key.toLowerCase() === 'group') {
        result.group = value;
      }
    }
    return result;
  };

  return (
    <div className="container">
      <CountriesFilter handleFilter={handleFilter} />
      <main className={styles.mainContainer}>
        {loading && <p className={styles.loadingText}>Loading...</p>}
        {apolloError && (
          <p className={styles.errorText}>{apolloError.message}</p>
        )}
        {filterError && <p className={styles.errorText}>{filterError}</p>}
        <CountriesList data={filteredAndGroupedData} />
      </main>
    </div>
  );
}

export default App;
