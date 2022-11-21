import React, { useState } from "react";
import styled from "styled-components";
import { DropdownProvider, useDropdown } from "./Dropdown-context";

const DropdownStyles = styled.label`
  position: relative;
  width: 100%;
  display: inline-block;
`;
const Dropdown = ({
  children,
  ...props
}) => {
  return (
    <DropdownProvider {...props}>
      <DropdownStyles>
        <div className="dropdown">
          {children}
        </div>
      </DropdownStyles>
    </DropdownProvider>
  );
};

export default Dropdown;
