import { CSSProperties, SyntheticEvent } from 'react';
import { GetCountriesQuery } from '../__generated__/graphql';
import styles from './CountriesListItem.module.css';

type Country = GetCountriesQuery['countries'][number];

type Props = {
  country: Country;
  index: number;
  handleClick?: (e: SyntheticEvent) => void;
  style?: CSSProperties;
};

export default function CountriesListItem({
  country,
  index,
  handleClick,
  style,
}: Props) {
  return (
    <li
      key={index}
      data-index={index}
      className={styles.item}
      style={style}
      onClick={handleClick}
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
  );
}
