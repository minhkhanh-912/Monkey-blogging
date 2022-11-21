import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import useCategory from "../../Hooks/useCategory";

const PostCategoryStles = styled.div`
  display: inline-block;
  padding: 0.4rem 1rem;
  background: #f3edff;
  border-radius: 1rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: #6b6b6b;
  a {
    display: block;
  }
  ${(props) =>
    props.type === "primary" &&
    css`
      background: #f3edff;
      color: #6b6b6b;
    `};
  ${(props) =>
    props.type === "secondary" &&
    css`
      background: white;
    `};
`;
const PostCategory = ({
  children,
  type = "primary",
  to = "/",
  className = "",
  categoryId = "",
}) => {
  const { category } = useCategory(categoryId);
  if (to)
    return (
      <PostCategoryStles type={type} className={className}>
        <Link to={`/category/${category?.slug}`}>{category?.name}</Link>
      </PostCategoryStles>
    );
  else {
    return (
      <PostCategoryStles type={type} className={className}>
        <div>{category?.name}</div>
      </PostCategoryStles>
    );
  }
};

export default PostCategory;
