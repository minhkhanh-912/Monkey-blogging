import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { v4 } from "uuid";
import { db } from "../../Firebase/Firebase-config";
import PostCommentItem from "./PostCommentItem";
const PostCommentstyles = styled.div``;
const PostComments = ({ PostId = "" }) => {
  const [CommentChild, setCommentChild] = useState({});
  const [CommentList, setCommentList] = useState({});
  useEffect(() => {
    async function getData() {
      const q = query(
        collection(db, "comments"),
        where("postId", "==", PostId),
        where("parentId", "==", ""),
        orderBy("createdAT", "desc")
      );
      await onSnapshot(q, (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setCommentList(results);
      });
    }
    getData();
  }, [PostId]);
  useEffect(() => {
    async function getData() {
      const q = query(
        collection(db, "comments"),
        where("postId", "==", PostId),
        orderBy("createdAT", "asc")
      );
      await onSnapshot(q, (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setCommentChild(results);
      });
    }
    getData();
  }, [PostId]);
  return (
    <PostCommentstyles>
      {CommentList.length > 0 &&
        CommentList.map((item) => (
          <PostCommentItem key={item.id} PostId={PostId} data={item}>
            {CommentChild.length > 0 &&
              CommentChild.filter((item) => item.parentId !== "").map(
                (filterItem) =>
                  item.id === filterItem.parentId && (
                    <PostCommentItem
                      key={filterItem.id}
                      PostId={PostId}
                      userId={item.userId}
                      data={filterItem}></PostCommentItem>
                  )
              )}
          </PostCommentItem>
        ))}
      {CommentList.length < 0 &&
        new Array(6)
          .fill(0)
          .map(() => <PostCommentItem key={v4()}></PostCommentItem>)}
    </PostCommentstyles>
  );
};

export default PostComments;
