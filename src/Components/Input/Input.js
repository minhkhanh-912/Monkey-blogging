import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";
import IconEyeOpen from "../icon/IconEyeOpen";
import PropTypes from "prop-types";
const InputStyles = styled.div`
  width: 100%;
  position: relative;
  input {
    width: 100%;
    padding: ${(props) =>
      props.hasIcon ? "1.2rem 5rem 1.2rem 2.7rem" : "1.2rem 2.7rem"};
    font-size: 1.6rem;
    font-weight: 500;
    line-height: 3rem;
    border-radius: 0.8rem;
    background-color: ${(props) => props.theme.grayLight};
    transition: all 0.2s linear;
    border: 1px solid transparent;
  }
  input:focus {
    background-color: white;
    border-color: ${(props) => props.theme.primary};
  }
  input::-webkit-input-placeholder {
    color: ${(props) => props.theme.textColor};
  }
  input::-moz-input-placeholder {
    color: ${(props) => props.theme.textColor};
  }
  .input-icon {
    position: absolute;
    top: 50%;
    right: 2rem;
    cursor: pointer;
    transform: translateY(-50%);
  }
`;
const Input = ({ type = "text", name = "", control, children, ...props }) => {
  const { field } = useController({
    name,
    control,
    defaultValue: "",
  });
  return (
    <InputStyles hasIcon={children ? true : false}>
      <input type={type} id={name} {...field} {...props} />
      {children ? <span className="input-icon">{children}</span> : null}
    </InputStyles>
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string,
  control: PropTypes.object.isRequired,
  children: PropTypes.node,
};
export default Input;
