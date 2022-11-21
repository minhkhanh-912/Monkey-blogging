import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { v4 } from "uuid";
import Heading from "../Components/Layout/Heading";
import Layout from "../Components/Layout/Layout";
import { db } from "../Firebase/Firebase-config";
import PostItem from "../Module/Posts/PostItem";

const CategoryPageStyles = styled.div``;
const CategoryPage = () => {
  const { slug } = useParams();
  const [CategoryList, setCategoryList] = useState({});
  useEffect(() => {
    async function getData() {
      const colRef = query(
        collection(db, "category"),
        where("slug", "==", slug)
      );
      await onSnapshot(colRef, (snapshot) => {
        snapshot.docs.forEach((doc) => {
          setCategoryList({
            id: doc.id,
            ...doc.data(),
          });
        });
      });
    }
    getData();
  }, [slug]);
  useEffect(() => {
    document.title =
      `Tin ${CategoryList?.name}`;
  }, [CategoryList?.name]);
  const [postList, setPostList] = useState([]);
  useEffect(() => {
    async function getData() {
      const colRef = query(
        collection(db, "post"),
        where("categoryId", "==", CategoryList.id)
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
  }, [CategoryList.id]);
  console.log(CategoryList);
  return (
    <CategoryPageStyles>
      <Layout>
        {CategoryList.id && (
          <>
            <div className="container home-block">
              <Heading>Danh Mục {CategoryList?.name}</Heading>
              <div className="grid-layout grid-layout--primary">
                {postList.length > 0 &&
                  postList.map((item) => (
                    <PostItem key={item.id} data={item}></PostItem>
                  ))}
              </div>
            </div>
          </>
        )}
        {!CategoryList.id && (
          <div className="container home-block">
            <Skeleton
              height={40}
              width={300}
              style={{ marginBottom: `3rem` }}></Skeleton>
            <div className="grid-layout grid-layout--primary">
              {postList.length <= 0 &&
                new Array(4)
                  .fill(0)
                  .map(() => <PostItem key={v4()}></PostItem>)}
            </div>
          </div>
        )}
      </Layout>
    </CategoryPageStyles>
  );
};

export default CategoryPage;
