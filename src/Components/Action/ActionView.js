import React from "react";
import styled from "styled-components";

const ActionViewStyles = styled.span`
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
  &:hover{
    border: 1px solid ${props => props.theme.primary};;
  }
`;
const ActionView = ({onClick=()=>{}}) => {
  return (
    <ActionViewStyles onClick={onClick}>
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
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    </ActionViewStyles>
  );
};

export default ActionView;
