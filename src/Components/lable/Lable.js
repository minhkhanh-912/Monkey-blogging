import React from "react";
import styled from "styled-components";

const LableStyles = styled.label`
  font-style: normal;
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 3rem;
  color: ${(props) => props.theme.grayDark};
  cursor: pointer;
`;
const Lable = ({htmlFor="", children, ...props}) => {
  return (
    <LableStyles htmlFor={htmlFor} className="form-lable" {...props}>
      {children}
    </LableStyles>
  );
};
 
export default Lable;
