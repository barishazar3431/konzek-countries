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
  initialVisibleCountryCount = 15, //default is 15, you can change it
}: Props) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [seeAllCountries, setSeeAllCountries] = useState(false);

  const countriesLength = calculateDataLength();

  useEffect(() => {
    setSelectedItemIndex(countriesLength < 10 ? countriesLength - 1 : 9);
    setSeeAllCountries(false);
    setSelectedColorIndex(0);
  }, [countriesLength, data]);

  function calculateDataLength() {
    if (!data) return 0;

    let length = 0;
    for (const key in data) {
      length += data[key].length;
    }
    return length;
  }

  const listItemClickHandler = (event: SyntheticEvent) => {
    const newSelectedIndex = Number(
      event.currentTarget.getAttribute('data-index')
    );
    if (newSelectedIndex === undefined) return;

    if (newSelectedIndex === selectedItemIndex) {
      setSelectedItemIndex(-1);
    } else {
      setSelectedItemIndex(newSelectedIndex);
      setSelectedColorIndex((selectedColorIndex + 1) % colors.length);
    }
  };

  let countryIndex = -1; //index of each country object.

  const shouldListStop = () => {
    return !seeAllCountries && countryIndex + 1 >= initialVisibleCountryCount;
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
                  countryIndex++;
                  return (
                    <CountriesListItem
                      key={countryIndex}
                      country={country}
                      index={countryIndex}
                      handleClick={listItemClickHandler}
                      style={
                        selectedItemIndex === countryIndex
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
      {countriesLength > initialVisibleCountryCount && (
        <button
          className={styles.showAllBtn}
          onClick={() => setSeeAllCountries((prevState) => !prevState)}
        >
          {seeAllCountries ? (
            <span>
              Show Fewer Countries ({initialVisibleCountryCount}) &uarr;
            </span>
          ) : (
            <span>Show All Countries ({countriesLength}) &darr;</span>
          )}
        </button>
      )}
    </div>
  );
}
