import { useQuery } from '@apollo/client';
import { gql } from './__generated__';
import CountriesList from './components/CountriesList';
import { useEffect, useState } from 'react';
import CountriesFilter from './components/CountriesFilter';
import { GetCountriesQuery } from './__generated__/graphql';

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
      emojiU
    }
  }
`);

function App() {
  const { data, loading, error } = useQuery(GET_COUNTRIES);
  const [filteredData, setFilteredData] = useState<GetCountriesQuery>();

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleFilter = (filterPrompt: string) => {
    if (!data) return;

    const { search } = parseFilterPrompt(filterPrompt);

    const filteredCountries = data.countries.filter(
      (country) =>
        country.name.toLowerCase().includes(search.toLowerCase()) ||
        country.continent.name.toLowerCase().includes(search.toLowerCase()) ||
        country.native.toLowerCase().includes(search.toLowerCase()) ||
        country.phone.toLowerCase().includes(search.toLowerCase()) ||
        country.languages.some((language) =>
          language.name.toLowerCase().includes(search.toLowerCase())
        ) ||
        (country.currency &&
          country.currency.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredData({ countries: filteredCountries });
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
      <CountriesList
        data={filteredData || { countries: [] }}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default App;
