import { SyntheticEvent, useEffect, useState } from 'react';
import styles from './CountriesList.module.css';
import colors from '../utils/colors';
import CountriesListItem from './CountriesListItem';
import { GroupedData } from '../App';

type Props = {
  data: GroupedData | undefined;
};

export default function CountriesList({ data }: Props) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  useEffect(() => {
    if (data) {
      setSelectedItemIndex(
        calculateGroupedLength(data) < 10 ? calculateGroupedLength(data) - 1 : 9
      );
    }
  }, [data]);

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

  let count = 0;

  return (
    <div>
      {data &&
        Object.entries(data).map(([key, list]) => {
          const groupItemCount = list.length;
          const groupStartIndex = count;
          count += groupItemCount;
          return (
            <>
              <p className={styles.listHeader}>
                {key} ({list.length} country)
              </p>
              <ul className={styles.list}>
                {list.map((country, index) => {
                  const cumulativeIndex = groupStartIndex + index;
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
            </>
          );
        })}
    </div>
  );
}
