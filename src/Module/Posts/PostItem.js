import React from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import useCategory from "../../Hooks/useCategory";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";

const PostItemStyles = styled.div`
  font-family: "Montserrat", sans-serif;
  .post {
    &-img {
      display: block;
      height: 20rem;
      margin-bottom: 1.6rem;
      border-radius: 1.5rem;
    }
    &-category {
      margin-bottom: 1.5rem;
    }
    &-title {
      margin-bottom: 1.5rem;
    }
    &-info {
      color: #6b6b6b;
    }
  }
  @media screen and (max-width: 1023.98px) {
    .post {
      &-img {
        aspect-ratio: 16/9;
        height: auto;
      }
    }
  }
`;
const PostItem = ({ data = "" }) => {
  if (!data) return <PostItemSkeleton></PostItemSkeleton>;
  return (
    <PostItemStyles>
      <PostImage url={data?.image} alt="" to={data?.slug}></PostImage>
      <PostCategory
        className="post-category"
        categoryId={data?.categoryId}></PostCategory>
      <PostTitle type="secondary" className="post-title" to={data?.slug}>
        {data?.title}
      </PostTitle>
      <PostMeta className="post-info" userId={data?.userId}></PostMeta>
    </PostItemStyles>
  );
};

export default PostItem;
const PostItemSkeleton = () => {
  return (
    <PostItemStyles>
      <Skeleton className="post-img"></Skeleton>
      <Skeleton className="post-category"></Skeleton>
      <Skeleton height={30} className="post-title"></Skeleton>
      <Skeleton className="post-info"></Skeleton>
    </PostItemStyles>
  );
};
