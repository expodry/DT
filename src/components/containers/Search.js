/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { useState } from 'react';

function Search(props) {
  const [value, setValue] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    props.grabLocationData(value);
    setValue('');
  };
  return (
    <form id="searchForm" onSubmit={handleSubmit}>
      <input
        placeholder="Search the destination!"
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      {/* <input value="Let's go!" type="submit" /> */}
    </form>
  );
}

export default Search;
