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

function App() {
  const { data, loading, error: apolloError } = useQuery(GET_COUNTRIES);
  const [filteredData, setFilteredData] = useState<Country[]>();
  const [filterError, setFilterError] = useState('');
  const [groupByTerm, setGroupByTerm] = useState('');

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

    filterCountries(search);
    setGroupByTerm(group);
  };

  const filterCountries = (searchTerm: string) => {
    const filtered =  data?.countries.filter(
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
    setFilteredData(filtered);
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
        <CountriesList data={filteredData} groupByTerm={groupByTerm}/>
      </main>
    </div>
  );
}

export default App;
