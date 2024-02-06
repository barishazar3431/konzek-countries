import { useQuery } from '@apollo/client';
import { gql } from './__generated__';

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
  const {data } = useQuery(GET_COUNTRIES);

 

  console.log(data?.countries[23]);

  return <p>Hello</p>;
}

export default App;
