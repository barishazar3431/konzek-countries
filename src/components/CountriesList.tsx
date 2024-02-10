import { SyntheticEvent, useEffect, useState } from 'react';
import { GetCountriesQuery } from '../__generated__/graphql';
import styles from './CountriesList.module.css';
import colors from '../utils/colors';
import { ApolloError } from '@apollo/client';

type Props = {
  data: GetCountriesQuery;
  groupByTerm?: string;
  loading: boolean;
  error: ApolloError | undefined;
};

export default function CountriesList({ data, loading, error }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(
      data.countries.length < 10 ? data.countries.length - 1 : 9
    );
  }, [data]);

  const listItemClickHandler = (event: SyntheticEvent) => {
    const newSelectedIndex = event.currentTarget.getAttribute('data-index');
    if (!newSelectedIndex) return;
    
    setSelectedIndex(Number(newSelectedIndex));
    setSelectedColorIndex((selectedColorIndex + 1) % colors.length);
  };

  return (
    <div className={styles.container}>
      {loading && <p className={styles.loadingText}>Loading...</p>}
      {error && <p className={styles.errorText}>{error.message}</p>}
      <ul className={styles.list}>
        {data.countries.map((country, index) => (
          <li
            key={index}
            data-index={index}
            className={styles.item}
            style={
              selectedIndex === index
                ? { background: colors[selectedColorIndex] || 'darkblue' }
                : {}
            }
            onClick={listItemClickHandler}
          >
            <span className={styles.itemCounter}>{index + 1}</span>
            <span className={styles.flag}>{country.emoji}</span>
            <div className={styles.details}>
              <p className={styles.countryName}>{country.name}</p>
              <div className={styles.countryInfo}>
                <span>Native: {country.native}</span>
                <span>Code: {country.code}</span>
                <span>Currency: {country.currency}</span>
                <span>Continent: {country.continent.name}</span>
                <span>Phone: +{country.phone}</span>
                <div>
                  <span>Languages: </span>
                  {country.languages.map((language, index, arr) => (
                    <span key={index}>
                      {language.name}
                      {index === arr.length - 1 ? '' : ', '}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
