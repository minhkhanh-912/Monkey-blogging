import React from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";

const PostNewestLargeStyles = styled.div`
  .post {
    &-img {
      display: block;
      height: 43rem;
      margin-bottom: 1.6rem;
      border-radius: 15px;
    }
    &-category {
      margin-bottom: 1rem;
    }
    &-title {
      margin-bottom: 1rem;
    }
    &-info {
      color: #6b6b6b;
    }
  }
`;
const PostNewestLarge = ({ data = "" }) => {
  if (!data) return <PostNewestLargeSkeleton></PostNewestLargeSkeleton>;
  return (
    <PostNewestLargeStyles>
      <PostImage url={data?.image} alt="" to={data?.slug}></PostImage>
      <PostCategory
        className="post-category"
        categoryId={data?.categoryId}></PostCategory>
      <PostTitle className="post-title" to={data?.slug}>
        {data?.title}
      </PostTitle>
      <PostMeta
        className="post-info"
        date={new Date(data?.createdAT.toDate()).toLocaleDateString("vi-VI")}
        userId={data?.userId}></PostMeta>
    </PostNewestLargeStyles>
  );
};

export default PostNewestLarge;

const PostNewestLargeSkeleton = () => {
  return (
    <PostNewestLargeStyles>
      <Skeleton height={430}></Skeleton>
      <Skeleton height={20} width={200} className="post-category"></Skeleton>
      <Skeleton height={20} className="post-title"></Skeleton>
      <Skeleton height={20} width={300} className="post-info"></Skeleton>
    </PostNewestLargeStyles>
  );
};
