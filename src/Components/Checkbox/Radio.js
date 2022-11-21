import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";

const RadioStyles = styled.label`
  .custom-radio {
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    font-weight: 500;
  }
  .radio{
    width: 3rem;
    height: 3rem;
    border-radius: 100%;
    background-color: #E7ECF3;
  }
  .radio-checked {
    width: 3rem;
    height: 3rem;
    border-radius: 100%;
    background-color: ${(props) => props.theme.primary};
  }
`;
const Radio = ({ control, checked, children, name, ...rest }) => {
  const { field } = useController({
    control,
    name,
    defaultValue: "",
  });
  return (
    <RadioStyles>
      <input
        type="radio"
        {...field}
        checked={checked}
        {...rest}
        className="Input-hidden"
      />
      <div className="custom-radio">
        {checked ? (
          <div className="radio-checked"></div>
        ) : (
          <div className="radio"></div>
        )}
        <span>{children}</span>
      </div>
    </RadioStyles>
  );
};

export default Radio;
