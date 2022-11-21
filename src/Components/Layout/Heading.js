import React from "react";
import styled from "styled-components";
import { useColor } from "../../contexts/Color-Context";

const HeadingStyles = styled.h1`
  font-size: 2.8rem;
  font-weight: 600;
  color: ${(props) => props.theme.Tertiary};
  font-family: "Montserrat", sans-serif;
  display: inline-block;
  position: relative;
  margin-bottom: 3rem;
  &:before {
    content: "";
    position: absolute;
    width: 3.5rem;
    height: 0.3rem;
    border-radius: 0.1rem;
    background-color: ${(props) => props.theme.primary};
    top: 0;
    left: 0;
    transform: translate(0, -150%);
  }
`;
const Heading = ({ children }) => {
  const { color, setcolor } = useColor();
  return <HeadingStyles>{children}</HeadingStyles>;
};

export default Heading;
