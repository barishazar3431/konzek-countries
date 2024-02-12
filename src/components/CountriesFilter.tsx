import styles from './CountriesFilter.module.css';

type Props = {
  handleFilter: (e: string) => void;
};

import { SyntheticEvent, useRef } from 'react';

export default function CountriesFilter({ handleFilter }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    if (!inputRef.current) return;

    handleFilter(inputRef.current.value);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        ref={inputRef}
        type="text"
        placeholder="E.g. search:tt group:continent"
      />
      <button className={styles.submitBtn} type="submit">
        Filter
      </button>
    </form>
  );
}
