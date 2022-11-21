import { async } from "@firebase/util";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Heading from "../Components/Layout/Heading";
import Layout from "../Components/Layout/Layout";
import { db } from "../Firebase/Firebase-config";
import PostCategory from "../Module/Posts/PostCategory";
import PostImage from "../Module/Posts/PostImage";
import PostItem from "../Module/Posts/PostItem";
import PostMeta from "../Module/Posts/PostMeta";
import PostTitle from "../Module/Posts/PostTitle";
import NotFoundPage from "./NotFoundPage";
import parse from "html-react-parser";
import useUser from "../Hooks/useUser";
import PostRelated from "../Module/Posts/PostRelated";
import TextArea from "../Components/TextArea/TextArea";
import { useForm } from "react-hook-form";
import Button from "../Components/Button/Button";
import Field from "../Components/Field/Field";
import Lable from "../Components/lable/Lable";
import { useAuth } from "../contexts/Auth-Context";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PostComments from "../Module/Posts/PostComments";
import Skeleton from "react-loading-skeleton";

const PostDetailPageStyles = styled.div`
  /* padding-bottom: 100px; */
  .post {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 4rem;
      margin: 4rem 0;
    }
    &-feature {
      width: 100%;
      max-width: 64rem;
      height: 46.6rem;
      border-radius: 2rem;
    }
    &-info {
      flex: 1;
    }
    &-heading {
      font-weight: bold;
      font-size: 3.6rem;
      margin-bottom: 1.6rem;
      margin-top: 1rem;
    }
    &-meta-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &-view {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: ${(props) => props.theme.gray6B};
    }
    &-meta {
      color: ${(props) => props.theme.gray6B};
    }
    &-content {
      font-family: "Montserrat", sans-serif;
      max-width: 70rem;
      margin: 8rem auto;
    }
    &-comments {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: stretch;
      align-content: flex-start;
      padding-bottom: 5px;
      &-img {
        width: 5rem;
        height: 5rem;
        border-radius: 100%;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        text-align: center;
        margin-right: 20px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
          object-fit: cover;
        }
      }
    }
  }
  .author {
    font-family: "Montserrat", sans-serif;
    margin: 4rem 0 8rem;
    display: flex;
    border-radius: 2rem;
    background-color: ${(props) => props.theme.grayf8};
    &-image {
      width: 20rem;
      height: 20rem;
      flex-shrink: 0;
      border-radius: inherit;
    }
    &-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    &-content {
      flex: 1;
      padding: 2rem;
    }
    &-name {
      font-weight: 600;
      margin-bottom: 1rem;
      font-size: 2rem;
      color: ${(props) => props.theme.primary};
    }
    &-desc {
      font-weight: 500;
      font-size: 1.4rem;
      line-height: 2;
    }
  }
  @media screen and (max-width: 1023.98px) {
    /* padding-bottom: 40px; */
    .post {
      &-header {
        flex-direction: column;
      }
      &-feature {
        max-width: 100%;
      }
    }
    .author {
      flex-direction: column;
      &-image {
        width: 100%;
        height: auto;
        aspect-ratio: 16/9;
      }
    }
  }
`;

const schema = yup
  .object({
    comment: yup.string().required(),
  })
  .required();
const PostDetailPage = () => {
  const {
    control,
    reset,
    watch,
    getValues,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { slug } = useParams();
  const [postList, setPostList] = useState({});
  const { userInfo } = useAuth();
  useEffect(() => {
    async function getData() {
      const colRef = query(collection(db, "post"), where("slug", "==", slug));
      await onSnapshot(colRef, (snapshot) => {
        snapshot.docs.forEach((doc) => {
          setPostList({
            id: doc.id,
            ...doc.data(),
          });
        });
      });
    }
    getData();
  }, [slug]);
  useEffect(() => {
    async function addData() {
      const colRef = collection(db, "postSeen");
      if (postList?.id && userInfo?.uid) {
        const q = query(
          colRef,
          where("postId", "==", postList?.id || ""),
          where("userId", "==", userInfo?.uid || "")
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length === 0 && postList?.id && userInfo?.uid) {
          await addDoc(colRef, {
            postId: postList?.id,
            userId: userInfo?.uid,
            createdAT: serverTimestamp(),
          });
        }
        const docRef = doc(db, "post", postList?.id);
        await updateDoc(docRef, {
          view: postList?.view + 1,
        });
      }
    }
    addData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postList?.id, userInfo?.uid]);
  useEffect(() => {
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [slug]);
  const handleComment = async (values) => {
    if (!isValid) return;
    const colRef = collection(db, "comments");
    try {
      await addDoc(colRef, {
        ...values,
        parentId: "",
        userId: userInfo?.uid,
        postId: postList?.id,
        createdAT: serverTimestamp(),
      });
      toast.success("Binh luan bai viet thanh cong!");
      reset({
        comment: "",
      });
    } catch (error) {
      toast.error(error);
    }
  };
  const valueComment = watch("comment");
  useEffect(() => {
    document.title = `${postList?.title || "Tin tức 24h"}`;
  }, [postList?.title]);
  if (!slug) return <NotFoundPage></NotFoundPage>;
  if (!postList.id) return <PostDetailPageSkeleton></PostDetailPageSkeleton>;
  return (
    <PostDetailPageStyles>
      <Layout>
        <div className="container home-block">
          <div className="post-header">
            <PostImage
              url={postList?.image}
              className="post-feature"></PostImage>
            <div className="post-info">
              <PostCategory categoryId={postList?.categoryId}></PostCategory>
              <h1 className="post-heading">{postList?.title}</h1>
              <div className="post-meta-wrap">
                <PostMeta
                  className="post-meta"
                  date={new Date(
                    postList?.createdAT?.toDate()
                  ).toLocaleDateString("vi-VI")}
                  userId={postList?.userId}></PostMeta>
                <div className="post-view">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.00017 15C12.7701 15 15.3556 12.6313 16.7568 10.8705C17.6388 9.76219 17.6388 8.23781 16.7568 7.1295C15.3556 5.36869 12.7701 3 9.00017 3C5.23027 3 2.64471 5.36869 1.24351 7.1295C0.36154 8.23781 0.36154 9.76219 1.24351 10.8705C2.64471 12.6313 5.23027 15 9.00017 15ZM9.00016 12C10.657 12 12.0002 10.6569 12.0002 9C12.0002 7.34315 10.657 6 9.00016 6C7.34331 6 6.00016 7.34315 6.00016 9C6.00016 10.6569 7.34331 12 9.00016 12Z"
                      fill="#777E91"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.50132 8.93645C7.50044 8.95753 7.5 8.97871 7.5 9C7.5 9.38042 7.64161 9.72776 7.875 9.99218C8.04633 10.1863 8.26712 10.3357 8.51765 10.4208C8.66903 10.4721 8.83126 10.5 9 10.5C9.82843 10.5 10.5 9.82843 10.5 9C10.5 8.83126 10.4721 8.66903 10.4208 8.51765C10.3357 8.26712 10.1863 8.04633 9.99218 7.875C9.72776 7.64161 9.38042 7.5 9 7.5C8.97871 7.5 8.95753 7.50044 8.93645 7.50132C8.97761 7.61824 9 7.74401 9 7.875C9 7.97309 8.98745 8.06824 8.96386 8.15895C8.86162 8.55209 8.55209 8.86162 8.15895 8.96386C8.06824 8.98745 7.97309 9 7.875 9C7.74401 9 7.61824 8.97761 7.50132 8.93645Z"
                      fill="#777E91"
                    />
                  </svg>
                  <span>{postList?.view || 0}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="post-content">
            <div className="entry-content">
              {parse(`${postList?.content || ""}`)}
            </div>
            <div className="author">
              <AuthorContent userId={postList?.userId}></AuthorContent>
            </div>
            <form onSubmit={handleSubmit(handleComment)}>
              <div className="post-comments">
                <div className="post-comments-img">
                  <img src={userInfo?.avatar || "/avatar.svg"} alt="" />
                </div>
                <TextArea
                  control={control}
                  name="comment"
                  placeholder="Tham gia binh luan"
                  style={{ marginBottom: "10px" }}></TextArea>
              </div>
              {userInfo ? (
                <Button
                  type="submit"
                  disabled={!valueComment}
                  style={{
                    height: "40px",
                    marginBottom: "40px",
                    marginLeft: "auto",
                  }}>
                  Add Comment
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={true}
                  style={{
                    height: "40px",
                    marginBottom: "40px",
                    marginLeft: "auto",
                  }}>
                  Vui long dang nhap de binh luan
                </Button>
              )}
            </form>
            <PostComments PostId={postList?.id}></PostComments>
          </div>
          <PostRelated categoryId={postList?.categoryId}></PostRelated>
        </div>
      </Layout>
    </PostDetailPageStyles>
  );
};

export default PostDetailPage;

const PostDetailPageSkeleton = () => {
  return (
    <PostDetailPageStyles>
      <Layout>
        <div className="container home-block">
          <div className="post-header">
            <Skeleton width={700} className="post-feature post-img"></Skeleton>
            <div className="post-info">
              <Skeleton className="post-category"></Skeleton>
              <Skeleton height={100} className="post-title"></Skeleton>
              <Skeleton width={100} className="post-info"></Skeleton>
            </div>
          </div>
          <div className="post-content">
            <Skeleton count={50}></Skeleton>
            <Skeleton
              width={700}
              className="post-feature post-img"
              style={{ margin: `3rem 0` }}></Skeleton>
            <Skeleton count={50}></Skeleton>
          </div>
          <PostRelated></PostRelated>
        </div>
      </Layout>
    </PostDetailPageStyles>
  );
};
const AuthorContent = ({ userId = "" }) => {
  const { user } = useUser(userId);
  if (!userId) return null;
  return (
    <>
      <div className="author-image">
        <img src={user?.avatar} alt="" />
      </div>
      <div className="author-content">
        <h3 className="author-name">{user.fullname}</h3>
        <p className="author-desc">{user?.description}</p>
      </div>
    </>
  );
};
