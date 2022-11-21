import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../Firebase/Firebase-config";

const PostCommenTitleStyles = styled.h3`
  font-size: 1.4rem;
  line-height: 2rem;
  color: #333;
  font-weight: 700;
  margin-bottom: 0.4rem;
`;
const PostCommenTitle = ({
  children,
  to = "/",
  className = "",
  postId = "",
}) => {
  const [post, setpost] = useState({});
  useEffect(() => {
    async function getDate() {
      if (!postId) return null;
      const docRef = doc(db, "post", postId);
      const snapshot = await getDoc(docRef);
      if (snapshot.data()) {
        setpost(snapshot.data());
      }
    }
    getDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log(post);
  return (
    <PostCommenTitleStyles>
      <Link to={`/${post?.slug}`}>{post?.title}</Link>
    </PostCommenTitleStyles>
  );
};

export default PostCommenTitle;
