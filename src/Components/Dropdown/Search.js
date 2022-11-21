import React from "react";
import styled from "styled-components";
import { useDropdown } from "./Dropdown-context";

const SearchStyles = styled.div`
  padding: 1rem;
  input{
    padding: 0.4rem 0.8rem;
    outline: none;
    width: 100%;
    border: 1px solid #e7ecf3;
    border-radius: 0.8rem;
  }
`;
const Search = ({ placeholder, ...props }) => {
  const { onChange } = useDropdown();
  return (
    <SearchStyles>
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        {...props}
      />
    </SearchStyles>
  );
};

export default Search;
