import { async } from "@firebase/util";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import Heading from "../../Components/Layout/Heading";
import { db } from "../../Firebase/Firebase-config";
import PostFeatureItem from "../Posts/PostFeatureItem";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HomeFeatureStyles = styled.div`
  font-family: "Montserrat", sans-serif;
`;
const HomeFeature = () => {
  const [posts, setposts] = useState([]);

  useEffect(() => {
    try {
      const colRef = collection(db, "post");
      const q = query(
        colRef,
        where("status", "==", 1),
        where("feature", "==", true),
        limit(3)
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
    } catch (error) {
      console.log(error);
    } finally {
    }
  }, []);
  // if (posts.length <= 0) return;
  return (
    <HomeFeatureStyles className="home-block">
      <div className="container">
        <Heading>Bài viết nổi bật</Heading>
        <div className="grid-layout">
          {posts.length > 0 &&
            posts.map((data) => (
              <PostFeatureItem key={data.id} data={data}></PostFeatureItem>
            ))}
          {posts.length <= 0 && (
            <>
              <Skeleton height={200} borderRadius={`1rem`}></Skeleton>
              <Skeleton height={200} borderRadius={`1rem`}></Skeleton>
              <Skeleton height={200} borderRadius={`1rem`}></Skeleton>
            </>
          )}
        </div>
      </div>
    </HomeFeatureStyles>
  );
};

export default HomeFeature;
