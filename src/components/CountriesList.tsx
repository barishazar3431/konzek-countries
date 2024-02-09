import { GetCountriesQuery } from '../__generated__/graphql';

type Props = {
  data: GetCountriesQuery | undefined;
  groupByTerm?: string;
};

export default function CountriesList({ data }: Props) {
  if (!data) return;

  return (
    <div>
      CountriesList
      {data.countries.map((country, index) => (
        <div key={index}>{country.name}</div>
      ))}
    </div>
  );
}
