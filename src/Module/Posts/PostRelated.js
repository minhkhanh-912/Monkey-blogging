import { async } from "@firebase/util";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { v4 } from "uuid";
import Heading from "../../Components/Layout/Heading";
import Layout from "../../Components/Layout/Layout";
import { db } from "../../Firebase/Firebase-config";
import PostItem from "./PostItem";

const PostRelatedStyles = styled.div``;
const PostRelated = ({ categoryId = "" }) => {
  const [postList, setPostList] = useState([]);
  useEffect(() => {
    async function getData() {
      const colRef = query(
        collection(db, "post"),
        where("categoryId", "==", categoryId)
      );
      await onSnapshot(colRef, (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPostList(results);
      });
    }
    getData();
  }, [categoryId]);
  if (!categoryId) return <PostRelatedSkeleton></PostRelatedSkeleton>;
  return (
    <PostRelatedStyles>
      {postList.length > 0 && (
        <>
          <Heading>Bài viết liên quan</Heading>
          <div className="grid-layout grid-layout--primary">
            {postList.length > 0 &&
              postList.map((item) => (
                <PostItem key={item.id} data={item}></PostItem>
              ))}
          </div>
        </>
      )}
      {postList.length <= 0 && (
        <>
          <Skeleton
            height={40}
            width={300}
            style={{ marginBottom: `3rem` }}></Skeleton>
          <div className="grid-layout grid-layout--primary">
            {postList.length <= 0 &&
              new Array(4).fill(0).map(() => <PostItem key={v4()}></PostItem>)}
          </div>
        </>
      )}
    </PostRelatedStyles>
  );
};

export default PostRelated;

const PostRelatedSkeleton = () => {
  return (
    <>
      <Skeleton
        height={40}
        width={300}
        style={{ marginBottom: `3rem` }}></Skeleton>
      <div className="grid-layout grid-layout--primary">
        {new Array(4).fill(0).map(() => (
          <PostItem key={v4()}></PostItem>
        ))}
      </div>
    </>
  );
};
