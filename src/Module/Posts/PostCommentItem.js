import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import styled from "styled-components";
import Button from "../../Components/Button/Button";
import TextArea from "../../Components/TextArea/TextArea";
import { useAuth } from "../../contexts/Auth-Context";
import { db } from "../../Firebase/Firebase-config";
import useUser from "../../Hooks/useUser";

const PostCommentItemStyles = styled.div`
  .post-comments {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;
    align-content: flex-start;
    padding-bottom: 5px;
    &-img {
      width: 5rem;
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
    &-info {
      display: flex;
      flex-direction: column;
      padding-bottom: 1rem;
      flex-grow: 1;
      width: calc(100% - 5rem);
    }
    &-name {
      color: ${(props) => props.theme.primary};
      font-weight: bold;
    }
    &-desc {
      color: ${(props) => props.theme.black};
      padding: 0.5rem 0;
    }
    &-footer {
      display: inline-flex;
      column-gap: 1rem;
      padding-bottom: 2rem;
      cursor: pointer;
      &:hover {
        svg {
          fill: #777777;
        }
        span {
          color: #777777;
        }
      }
      svg {
        vertical-align: middle;
        transform: rotate(180deg);
        width: 22px;
        height: 22px;
        opacity: 0.7;
        fill: #999999;
        margin-right: 2px;
      }
    }
    &-repto {
      font-size: 1.2rem;
      margin-bottom: 6px;
      border-left: 1px solid #cccccc;
      padding: 5px 10px;
      color: #999999;
      font-style: italic;
      span {
        color: ${(props) => props.theme.primary};
        font-weight: 500;
      }
    }
  }
`;
const PostCommentItem = ({ PostId = "", data = "", children, userId = "" }) => {
  const {
    control,
    reset,
    watch,
    getValues,
    formState: { isValid },
    handleSubmit,
  } = useForm({
    mode: "onChange",
  });
  const valueComment = watch("comment");
  const [show, setshow] = useState(false);
  const { user } = useUser(data?.userId);
  const { userInfo } = useAuth();
  const { user: userParent } = useUser(userId);
  const handleComment = async (values) => {
    if (!isValid) return;
    const colRef = collection(db, "comments");
    try {
      await addDoc(colRef, {
        ...values,
        userId: userInfo?.uid,
        parentId: data?.id,
        postId: PostId,
        createdAT: serverTimestamp(),
      });
      toast.success("Binh luan bai viet thanh cong!");
      reset({
        comment: "",
      });
      setshow(false);
    } catch (error) {
      toast.error(error);
    }
  };
  if (!data?.userId) return <PostCommentItemSkeleton></PostCommentItemSkeleton>;
  //   const { user } = useUser(data?.userId);
  return (
    <PostCommentItemStyles>
      <div className="post-comments">
        <div className="post-comments-img">
          <img src={user?.avatar || "/avatar.svg"} alt="" />
        </div>
        <div className="post-comments-info">
          <div className="post-comments-name">{user?.fullname}</div>
          {!children ? (
            <div className="post-comments-repto">
              Reply to <span>{userParent?.fullname}</span>
            </div>
          ) : (
            ""
          )}
          <div className="post-comments-desc">{data?.comment}</div>
          {children ? (
            <div
              className="post-comments-footer"
              onClick={() => setshow(!show)}>
              <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"></path>
                <path d="M0 0h24v24H0z" fill="none"></path>
              </svg>
              <span>Trả lời</span>
            </div>
          ) : (
            ""
          )}
          {children ? children : ""}
        </div>
      </div>
      {show && (
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
      )}
    </PostCommentItemStyles>
  );
};

export default PostCommentItem;

const PostCommentItemSkeleton = () => {
  return (
    <PostCommentItemStyles>
      <div className="post-comments">
        <Skeleton className="post-comments-img"></Skeleton>
        <div className="post-comments-info">
          <Skeleton className="post-comments-name"></Skeleton>
          <Skeleton className="post-comments-desc"></Skeleton>
        </div>
      </div>
    </PostCommentItemStyles>
  );
};
