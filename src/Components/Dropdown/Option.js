import React from "react";
import styled from "styled-components";
import { useDropdown } from "./Dropdown-context";

const OptionStyles = styled.div`
  padding: 2rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s linear;
  &:hover {
    background: #e7ecf3;
  }
`;

const Option = ({ onClick, ...props }) => {
  const { setShow } = useDropdown();
  const handleClick = () => {
    onClick && onClick();
    setShow(false);
  };
  return (
    <OptionStyles onClick={handleClick} {...props}>
      {props.children}
    </OptionStyles>
  );
};

export default Option;
