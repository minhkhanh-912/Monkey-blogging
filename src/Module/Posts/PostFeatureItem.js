import { async } from "@firebase/util";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import slugify from "slugify";
import styled from "styled-components";
import { db } from "../../Firebase/Firebase-config";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";

const PostFeatureIemStyles = styled.div`
  width: 100%;
  position: relative;
  height: 16.9rem;
  .post {
    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 1.5rem;
    }
    &-overlay-blue {
      position: absolute;
      inset: 0;
      background: #6e33f1;
      mix-blend-mode: color;
      opacity: 0.6;
      border-radius: 15px;
    }
    &-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        179.77deg,
        #6b6b6b 36.45%,
        rgba(163, 163, 163, 0.622265) 63.98%,
        rgba(255, 255, 255, 0) 99.8%
      );
      mix-blend-mode: multiply;
      opacity: 0.6;
      border-radius: 1.5rem;
    }
    &-content {
      position: absolute;
      inset: 0;
      z-index: 2;
      padding: 2rem 1rem 0 2rem;
      color: white;
    }
    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.6rem;
    }
    &-time {
      align-items: center;
      font-size: 1.4rem;
      font-weight: 600;
    }
  }
  @media screen and (max-width: 1023.98px) {
    .post {
      &-content {
        padding: 1.5rem;
      }
    }
  }
  @media screen and (min-width: 1024px) {
    height: 25rem;
  }
`;
const PostFeatureItem = ({ data }) => {
  const [user, setuser] = useState("");
  useEffect(() => {
    async function getUser() {
      const colRefSingle = doc(db, "users", data.userId);
      const snapdoc = await getDoc(colRefSingle);
      setuser(snapdoc.data());
    }
    getUser();
  }, [data.userId]);
  if (!data || !data.id) return;

  const date = data.createdAT.toDate();
  const fomatDate = new Date(date).toLocaleDateString("vi-VI");
  return (
    <PostFeatureIemStyles>
      <PostImage url={data.image} alt=""></PostImage>
      <div className="post-overlay-blue"></div>
      <div className="post-overlay"></div>
      <div className="post-content">
        <div className="post-top">
          <PostCategory categoryId={data?.categoryId}></PostCategory>
          <div className="post-time">{fomatDate}</div>
        </div>
        <PostTitle to={data?.slug} className="post-title">
          {data?.title}
        </PostTitle>
      </div>
    </PostFeatureIemStyles>
  );
};

export default PostFeatureItem;
