import { SyntheticEvent, useEffect, useState } from 'react';
import styles from './CountriesList.module.css';
import colors from '../utils/colors';
import CountriesListItem from './CountriesListItem';
import { GroupedData } from '../App';

type Props = {
  data: GroupedData | undefined;
  initialVisibleCountryCount?: number;
};

export default function CountriesList({
  data,
  initialVisibleCountryCount = 20, //default is 15, you can change it
}: Props) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [seeAllCountries, setSeeAllCountries] = useState(false);

  useEffect(() => {
    if (data) {
      const countriesLength = calculateGroupedLength(data);
      setSelectedItemIndex(countriesLength < 10 ? countriesLength - 1 : 9);

      setSeeAllCountries(countriesLength <= initialVisibleCountryCount);
    }
  }, [data, initialVisibleCountryCount]);

  const calculateGroupedLength = (obj: GroupedData) => {
    let length = 0;
    for (const key in obj) {
      length += obj[key].length;
    }
    return length;
  };

  const listItemClickHandler = (event: SyntheticEvent) => {
    const newSelectedIndex = Number(
      event.currentTarget.getAttribute('data-index')
    );
    if (newSelectedIndex === undefined) return;

    if (newSelectedIndex === selectedItemIndex) {
      setSelectedItemIndex(-1);
    } else {
      setSelectedItemIndex(newSelectedIndex);
    }

    setSelectedColorIndex((selectedColorIndex + 1) % colors.length);
  };

  let cumulativeIndex = -1; //index of each country object.

  const shouldListStop = () => {
    return (
      !seeAllCountries && cumulativeIndex + 1 >= initialVisibleCountryCount
    );
  };

  return (
    <div>
      {data &&
        Object.entries(data).map(([key, list], index) => {
          if (shouldListStop()) {
            return;
          }
          return (
            <section className={styles.countryGroup} key={index}>
              <h2 className={styles.listHeader}>
                {key} ({list.length} country)
              </h2>
              <ul className={styles.list}>
                {list.map((country) => {
                  if (shouldListStop()) {
                    return;
                  }
                  cumulativeIndex++;
                  return (
                    <CountriesListItem
                      key={cumulativeIndex}
                      country={country}
                      index={cumulativeIndex}
                      handleClick={listItemClickHandler}
                      style={
                        selectedItemIndex === cumulativeIndex
                          ? {
                              background:
                                colors[selectedColorIndex] || 'darkblue',
                            }
                          : {}
                      }
                    />
                  );
                })}
              </ul>
            </section>
          );
        })}
      {data && !seeAllCountries && (
        <button
          className={styles.showAllBtn}
          onClick={() => setSeeAllCountries(true)}
        >
          See All Countries ({calculateGroupedLength(data)}) &darr;
        </button>
      )}
    </div>
  );
}
