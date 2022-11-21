import React from "react";
import styled from "styled-components";

const ActionDeleteStyles = styled.span`
  width: 4rem;
  height: 4rem;
  border: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s linear;
  svg {
    width: 2rem;
    height: 2rem;
  }
  &:hover {
    border: 1px solid ${(props) => props.theme.primary};
  }
`;
const ActionDelete = ({onClick=()=>{}}) => {
  return (
    <ActionDeleteStyles onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </ActionDeleteStyles>
  );
};

export default ActionDelete;
