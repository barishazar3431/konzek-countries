import { SyntheticEvent, useEffect, useState } from 'react';
import styles from './CountriesList.module.css';
import colors from '../utils/colors';
import CountriesListItem from './CountriesListItem';
import { Country } from '../App';

type Props = {
  data: Country[] | undefined;
  groupByTerm?: string;
};

export default function CountriesList({ data }: Props) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  useEffect(() => {
    if (data) {
      setSelectedItemIndex(data.length < 10 ? data.length - 1 : 9);
    }
  }, [data]);

  const listItemClickHandler = (event: SyntheticEvent) => {
    const newSelectedIndex = event.currentTarget.getAttribute('data-index');
    if (!newSelectedIndex) return;

    setSelectedItemIndex(Number(newSelectedIndex));
    setSelectedColorIndex((selectedColorIndex + 1) % colors.length);
  };

  return (
    <ul className={styles.list}>
      {data?.map((country, index) => (
        <CountriesListItem
          country={country}
          index={index}
          handleClick={listItemClickHandler}
          style={
            selectedItemIndex === index
              ? { background: colors[selectedColorIndex] || 'darkblue' }
              : {}
          }
        />
      ))}
    </ul>
  );
}
