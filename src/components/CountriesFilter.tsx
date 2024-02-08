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
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} type="text" placeholder="Filter the results" />
      <button type="submit">Filter</button>
    </form>
  );
}
