import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ToggleStyles = styled.label`
  .toggle {
    display: inline-block;
    width: 10rem;
    height: 4.2rem;
    background-color: ${(props) => props.theme.grayLight};
    border-radius: 10rem;
    cursor: pointer;
    padding: 0.6rem;
    &-Circle {
      display: inline-block;
      width: 3rem;
      height: 3rem;
      background-color: white;
      border-radius: 100%;
      transition: all 0.2s linear;
    }
    &.active {
      background-color: ${(props) => props.theme.primary};
      & .toggle-Circle {
        transform: translateX(5.8rem);
      }
    }
  }
`;
const Toggle = ({ on, onClick = () => {}, ...rest }) => {
  return (
    <ToggleStyles>
      <input
        type="checkbox"
        defaultChecked={on}
        className="Input-hidden"
        onClick={onClick}
      />
      <div className={`toggle ${on ? "active" : ""}`} {...rest}>
        <span className="toggle-Circle"></span>
      </div>
    </ToggleStyles>
  );
};

Toggle.propTypes = {};

export default Toggle;
