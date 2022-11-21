import { doc, getDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import slugify from "slugify";
import styled from "styled-components";
import { db } from "../../Firebase/Firebase-config";
import useUser from "../../Hooks/useUser";

const PostMetaStyles = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 600;
  color: inherit;
  .post-dot {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 100%;
    background-color: currentColor;
  }
`;
const PostMeta = ({
  to = "/",
  date = "Mar 23",
  userId = "",
  className = "",
}) => {
  const { user } = useUser(userId);
  const slugName = slugify(`${user?.fullname}`, { lower: true });
  if (!userId) return null;
  return (
    <PostMetaStyles className={className}>
      <div className="post-time">{date}</div>
      <div className="post-dot"></div>
      <Link to={`/Author/${slugName || ""}`}>
        <div className="post-author">{user?.fullname}</div>
      </Link>
    </PostMetaStyles>
  );
};

export default PostMeta;
