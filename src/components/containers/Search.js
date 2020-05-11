import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Search(props) {
  const [value, setValue] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    let bigAssObject = props.grabLocationData(value);
    setValue('');
    return bigAssObject;
  };
  return (
    <form onSubmit={handleSubmit}>
      <input onChange={(e) => setValue(e.target.value)} value={value} />
      <input value="Let's go!" type="submit" />
    </form>
  );
}

export default Search;
