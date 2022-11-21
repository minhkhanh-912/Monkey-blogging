import React from "react";
import styled, { css } from "styled-components";

const LableStatusStyled = styled.span`
  display: inline-block;
  padding: 1rem 1.5rem;
  border-radius: 0.8rem;
  font-size: 1.4rem;
  font-weight: 500;
  ${(props) =>
    props.type === "default" &&
    css`
      color: ${(props) => props.theme.gray80};
      background: #f7f7f8;
    `};
  ${(props) =>
    props.type === "success" &&
    css`
      color: ${(props) => props.theme.success};
      background: rgb(220 252 231);
    `};
  ${(props) =>
    props.type === "warning" &&
    css`
      color: ${(props) => props.theme.warning};
      background: rgb(255 237 213);
    `};
  ${(props) =>
    props.type === "danger" &&
    css`
      color: ${(props) => props.theme.danger};
      background: rgb(254 226 226);
    `};
`;
const LableStatus = ({ children, type = "default" }) => {
  return <LableStatusStyled type={type}>{children}</LableStatusStyled>;
};

export default LableStatus;
