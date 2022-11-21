import {
  collection,
  endAt,
  onSnapshot,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Layout from "../Components/Layout/Layout";
import { db } from "../Firebase/Firebase-config";
import PostNewestItem from "../Module/Posts/PostNewestItem";
import PostRelated from "../Module/Posts/PostRelated";

const SearchPageStyles = styled.div`
  .Search-title {
    text-align: center;
    margin: 4rem;
  }
  .content {
    margin-bottom: 5rem;
  }
`;
const SeachPage = () => {
  const [search] = useSearchParams();
  const [PostList, setPostList] = useState({});
  const SearchPram = search.get("Search");
  const CategoryIdRandom = PostList[0]?.categoryId;
  useEffect(() => {
    async function getData() {
      const q = query(
        collection(db, "post"),
        orderBy("title"),
        startAt(`${SearchPram}`),
        endAt("SUBSTRING\uf8ff")
      );
      await onSnapshot(q, (snapshot) => {
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
  }, [SearchPram]);
  if (!search) return;
  return (
    <SearchPageStyles>
      <Layout>
        <div className="container home-block" >
          <h2 className="Search-title">{SearchPram}</h2>
          <div className="content">
            {PostList.length > 0
              ? PostList.map((item) => (
                  <PostNewestItem data={item}></PostNewestItem>
                ))
              : `Tìm thấy 0 kết quả về cho từ "${SearchPram}"`}
          </div>
          <PostRelated categoryId={CategoryIdRandom}></PostRelated>
        </div>
      </Layout>
    </SearchPageStyles>
  );
};

export default SeachPage;
