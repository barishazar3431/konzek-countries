import { useQuery } from '@apollo/client';
import { gql } from './__generated__';
import CountriesList from './components/CountriesList';
import { useEffect, useState } from 'react';
import CountriesFilter from './components/CountriesFilter';

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
  const [filteredData, setFilteredData] = useState<typeof data>();

  useEffect(() => {
    setFilteredData(data);
    console.log(data?.countries[0]);
  }, [data]);

  const handleFilter = (filterPrompt: string) => {
    console.log(filterPrompt);
  };

  return (
    <>
      <CountriesFilter handleFilter={handleFilter} />
      <CountriesList data={filteredData} />
    </>
  );
}

export default App;
