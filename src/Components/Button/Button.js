import React from "react";
import styled, { css } from "styled-components";
import LoadingSpinner from "../loading/LoadingSpinner";
import PropTypes, { string } from "prop-types";
import { NavLink } from "react-router-dom";
import { useColor } from "../../contexts/Color-Context";
const ButtonStyles = styled.button`
  cursor: pointer;
  font-style: normal;
  font-weight: 600;
  font-size: 1.8rem;
  line-height: 3.6rem;
  height: ${(props) => props.height || "66px"};
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  ${(props) =>
    props.bg === "secondary" &&
    css`
      background-color: white;
      color: ${(props) => props.theme.primary};
    `};
  ${(props) =>
    props.bg === "primary" &&
    css`
      color: white;
      background: linear-gradient(
        to right bottom,
        ${(props) => props.theme.primary},
        ${(props) => props.theme.secondary}
      );
    `};
  ${(props) =>
    props.bg === "ghost" &&
    css`
      background: #dce2df;
      color: ${(props) => props.theme.primary};
    `};
  border-radius: 0.8rem;
  padding: 1.5rem;
  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;
const Button = ({
  type = "submit",
  onClick = () => {},
  children,
  bg = "primary",
  ...props
}) => {
  const { color, setcolor } = useColor();
  const { isloading, to } = props;
  const child = !!isloading ? <LoadingSpinner></LoadingSpinner> : children;
  if (to !== "" && typeof to === "string") {
    return (
      <NavLink to={to} style={{ display: "inline-block" }}>
        <ButtonStyles type={type} bg={bg} {...props}>
          {child}
        </ButtonStyles>
      </NavLink>
    );
  }
  return (
    <ButtonStyles type={type} bg={bg} onClick={onClick} {...props}>
      {child}
    </ButtonStyles>
  );
};
Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit"]),
  isloading: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default Button;
