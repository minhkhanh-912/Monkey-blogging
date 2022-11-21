import React from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";

const PostFeatureItemStyles = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 2.8rem;
  margin-bottom: 2.8rem;
  &:last-child {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: 0;
  }
  .post {
    &-img {
      width: 18.1rem;
      height: 13rem;
      border-radius: 1rem;
    }
    &-category {
      margin-bottom: 1rem;
    }
    &-title {
      margin-bottom: 1rem;
    }
    &-content {
      flex: 1;
    }
    &-info {
      color: #6b6b6b;
    }
  }
`;
const PostNewestItem = ({ data = "" }) => {
  if (!data) return <PostNewestItemSkeleton></PostNewestItemSkeleton>;
  return (
    <PostFeatureItemStyles>
      <PostImage url={data?.image} alt="" to={data?.slug}></PostImage>
      <div className="post-content">
        <PostCategory
          type="secondary"
          className="post-category"
          categoryId={data?.categoryId}></PostCategory>
        <PostTitle type="secondary" className="post-title" to={data?.slug}>
          {data?.title}
        </PostTitle>
        <PostMeta
          className="post-info"
          date={new Date(data?.createdAT.toDate()).toLocaleDateString("vi-VI")}
          userId={data?.userId}></PostMeta>
      </div>
    </PostFeatureItemStyles>
  );
};

export default PostNewestItem;
const PostNewestItemSkeleton = () => {
  return (
    <PostFeatureItemStyles>
      <Skeleton className="post-img"></Skeleton>
      <div className="post-content">
        <Skeleton className="post-category"></Skeleton>
        <Skeleton className="post-title"></Skeleton>
        <Skeleton className="post-info"></Skeleton>
      </div>
    </PostFeatureItemStyles>
  );
};
