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

type StringKeys = 'code' | 'name' | 'native' | 'phone' | 'currency' | 'emoji';

function App() {
  const { data, loading, error: apolloError } = useQuery(GET_COUNTRIES);
  const [filteredData, setFilteredData] = useState<Country[]>();
  const [filterError, setFilterError] = useState('');

  useEffect(() => {
    setFilteredData(data?.countries);
  }, [data]);

  const handleFilter = (filterPrompt: string) => {
    if (!data) return;

    setFilterError('');
    const { search, group } = parseFilterPrompt(filterPrompt);
    if (!search && !group) {
      setFilterError(
        `The input "${filterPrompt}" is wrong. Correct format is "search:abc group:xyz"`
      );
      return;
    }

    if (group && !(group in data.countries[0])) {
      setFilterError(
        `The attribute "${group}" does not exist on country object!`
      );
      return;
    }

    filterCountries(search, group);
  };

  const filterCountries = (searchTerm: string, groupBy: string) => {
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

    const groupedData = filtered.reduce((acc, country) => {
      if (typeof country[groupBy as keyof Country] === 'string') {
        const group = acc[country[groupBy as StringKeys] || 'None'] || [];
        group.push(country);
        acc[country[groupBy as StringKeys] || 'None'] = group;
      } else if (groupBy === 'continent') {
        const group = acc[country[groupBy].name] || [];
        group.push(country);
        acc[country[groupBy].name || 'None'] = group;
      }
      return acc;
    }, {} as GroupedData);
    console.log(groupedData);
    calculateLength(groupedData);
    setFilteredData(filtered);
  };

  const calculateLength = (obj: GroupedData) => {
    let length = 0;
    for (const key in obj) {
      length += obj[key].length;
    }
    console.log(length);
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
        <CountriesList data={filteredData} />
      </main>
    </div>
  );
}

export default App;
