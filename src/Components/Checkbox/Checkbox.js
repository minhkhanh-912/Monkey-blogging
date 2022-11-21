import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";

const CheckboxStyles = styled.label`
  .custom-checkbox {
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    font-weight: 500;
  }
  .checkbox {
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    background-color: #e7ecf3;
  }
  .checkbox-checked {
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    background-color: ${(props) => props.theme.primary};
    color: white;
  }
`;
const Checkbox = ({ control, name, children, checked, ...rest }) => {
  const { field } = useController({
    control,
    name,
    defaultValue: "",
  });
  return (
    <CheckboxStyles>
      <input
        type="checkbox"
        {...field}
        {...rest}
        className="Input-hidden"
      />
      <div className="custom-checkbox">
        {checked ? (
          <div className="checkbox-checked">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        ) : (
          <div className="checkbox"></div>
        )}
        <span>{children}</span>
      </div>
    </CheckboxStyles>
  );
};

export default Checkbox;
