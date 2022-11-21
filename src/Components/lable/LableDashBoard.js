import React from "react";
import styled, { css } from "styled-components";

const LableDashBoardstyles = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  padding: 1rem 1.5rem;
  width: 100%;
  height: 10rem;
  border-radius: 0.8rem;
  font-size: 1.4rem;
  font-weight: 500;
  ${(props) =>
    props.type === "default" &&
    css`
      color: ${(props) => props.theme.gray80};
      background: #d9edf7;
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
const LableDashBoard = ({ children, type = "default" }) => {
  return <LableDashBoardstyles type={type}>{children}</LableDashBoardstyles>;
};

export default LableDashBoard;
