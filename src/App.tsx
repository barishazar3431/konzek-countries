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
  const { data } = useQuery(GET_COUNTRIES);
  const [filteredData, setFilteredData] = useState<GetCountriesQuery>();


  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleFilter = (filterPrompt: string) => {
    if (!data) return;

    const {search} = parseFilterPrompt(filterPrompt);

    const filteredCountries = data.countries.filter((country) =>
      country.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData({ countries: filteredCountries });
  };

  const parseFilterPrompt = (prompt: string) => {
    const regex = /(search|group)+:(\w+)/g;

    let match;
    const result = {
      search: '',
      group: '',
    };

    while ((match = regex.exec(prompt)) !== null) {
      const [, key, value] = match;
      if (key === 'search') {
        result.search = value; 
      }
      if (key === 'group') {
        result.group = value;
      }
    }
    return result;
  };

  return (
    <>
      <CountriesFilter handleFilter={handleFilter} />
      <CountriesList data={filteredData} />
    </>
  );
}

export default App;
