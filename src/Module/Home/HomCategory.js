import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { v4 } from "uuid";
import Heading from "../../Components/Layout/Heading";
import { db } from "../../Firebase/Firebase-config";
import PostItem from "../Posts/PostItem";

const HomCategoryStyles = styled.div``;
const HomCategory = () => {
  const [categories, setcategories] = useState({});
  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "category");
      const q = query(colRef, where("status", "==", 1), limit(14));
      let results = [];
      onSnapshot(q, (Snapshot) => {
        Snapshot.docs.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setcategories(results);
      });
    }
    getData();
  }, []);
  const [posts, setposts] = useState([]);
  useEffect(() => {
    async function getPost() {
      const colRef = collection(db, "post");
      const q = query(colRef, where("status", "==", 1));
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
  // if (posts.length <= 0) return;
  // if (categories.length <= 0) return;
  let temp = 0;
  return (
    <HomCategoryStyles>
      <div className="container">
        {categories.length > 0 &&
          categories.map((category, indexcate) => {
            return (
              <div key={category?.id} className="home-block">
                <Heading>{category?.name}</Heading>
                <div className="grid-layout grid-layout--primary ">
                  {posts.length > 0 &&
                    posts.map((post, index) => {
                      if (post?.categoryId === category.id) {
                        temp++;
                        if (temp >= 4) {
                          temp = 1;
                          return null;
                        }
                        return <PostItem key={post?.id} data={post}></PostItem>;
                      }
                      // eslint-disable-next-line array-callback-return
                      return;
                    })}
                </div>
              </div>
            );
          })}
        {categories.length <= 0 &&
          categories.map((category) => (
            <div key={category?.id} className="home-block">
              <Skeleton
                height={40}
                width={300}
                style={{ marginBottom: `3rem` }}></Skeleton>
              <div className="grid-layout grid-layout--primary">
                {posts.length <= 0 &&
                  new Array(4)
                    .fill(0)
                    .map(() => <PostItem key={v4()}></PostItem>)}
              </div>
            </div>
          ))}
      </div>
    </HomCategoryStyles>
  );
};

export default HomCategory;
