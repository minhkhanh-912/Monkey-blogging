import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";

const PostImageStyles = styled.div`
  img {
    width: 100%;
    height: 100%;
    box-shadow: 0px 12px 25px -12px rgba(53, 70, 131, 0.15);
    object-fit: cover;
    border-radius: inherit;
  }
`;
const PostImage = ({ className = "", url = "", to = null, alt = "" }) => {
  if (to) {
    return (
      <Link to={`/${to}`} style={{display: "block"}}>
        <PostImageStyles className={`${className} post-img`}>
          <img src={url} alt={alt} tooding="lazy" />
        </PostImageStyles>
      </Link>
    );
  }
  return (
    <PostImageStyles className={`${className} post-img`}>
      <img src={url} alt={alt} tooding="lazy" />
    </PostImageStyles>
  );
};

export default PostImage;
