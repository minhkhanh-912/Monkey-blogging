import React from "react";
import styled, { css } from "styled-components";
import { useDropdown } from "./Dropdown-context";

const SelectStyles = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background-color: #e7ecf3;
  border-radius: 1rem;
  ${(props) =>
    props.show &&
    css`
      border-radius: 1rem 1rem 0 0;
    `};
    ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
    `};
  svg {
    width: 2rem;
    height: 2rem;
  }
`;
const Select = ({ placehodler = "Please select an option", disabled="" }) => {
  const { show, toggle, nodeRef } = useDropdown();
  if (disabled) {
    return (
      <SelectStyles disabled={disabled}>
        <span>{placehodler}</span>
      </SelectStyles>
    );
  }
  return (
    <SelectStyles onClick={toggle} show={show} ref={nodeRef}>
      <span>{placehodler}</span>
      {show ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      )}
    </SelectStyles>
  );
};

export default Select;
