import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled, { css } from "styled-components";

const PostTitleStyles = styled.h1`
  font-weight: bold;
  line-height: 1.5;
  a{
    display: block;
  }
  ${(props) =>
    props.type === "primary" &&
    css`
      font-size: 2.2rem;
    `};
  ${(props) =>
    props.type === "secondary" &&
    css`
      font-size: 1.8rem;
    `};
`;
const PostTitle = ({children , type="primary" ,to="/" , className=""}) => {
  return <PostTitleStyles type={type} className={className}>
    <Link to={`/${to}`}>{children}</Link>
  </PostTitleStyles>;
};

export default PostTitle;
