import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { v4 } from "uuid";
import Heading from "../../Components/Layout/Heading";
import { db } from "../../Firebase/Firebase-config";
import PostItem from "../Posts/PostItem";
import PostNewestItem from "../Posts/PostNewestItem";
import PostNewestLarge from "../Posts/PostNewestLarge";

const HomeNewestStyles = styled.div`
  font-family: "Montserrat", sans-serif;
  .layout {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;
    align-items: start;
  }
  .sidebar {
    background: #f3edff;
    border-radius: 15px;
    padding: 3rem 1.9rem;
  }
  @media screen and (max-width: 1023.98px) {
    .layout {
      grid-template-columns: 100%;
    }
    .sidebar {
      padding: 14px 10px;
    }
  }
`;
const HomeNewest = () => {
  const [posts, setposts] = useState([]);
  useEffect(() => {
    async function getPost() {
      const colRef = collection(db, "post");
      const q = query(
        colRef,
        where("status", "==", 1),
        where("feature", "==", false),
        limit(4)
      );
      onSnapshot(q, (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setposts(results);
      });
    }
    getPost();
  }, []);
  const [postlarge, ...postItem] = posts;
  // if (posts.length <= 0) return;
  return (
    <HomeNewestStyles className="home-block">
      <div className="container">
        <Heading>Mới nhất</Heading>
        {postItem.length > 0 && (
          <div className="layout">
            <PostNewestLarge data={postlarge}></PostNewestLarge>
            <div className="sidebar">
              {postItem.length > 0 &&
                postItem.map((item) => (
                  <PostNewestItem data={item} key={item.id}></PostNewestItem>
                ))}
            </div>
          </div>
        )}
        {posts.length <= 0 && (
          <div className="layout">
            <PostNewestLarge></PostNewestLarge>
            <div className="sidebar">
              {new Array(3).fill(0).map(() => (
                <PostNewestItem key={v4()} ></PostNewestItem>
              ))}
            </div>
          </div>
        )}
      </div>
    </HomeNewestStyles>
  );
};

export default HomeNewest;
