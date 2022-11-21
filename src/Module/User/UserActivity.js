import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../contexts/Auth-Context";
import { db } from "../../Firebase/Firebase-config";
import useUser from "../../Hooks/useUser";
import PostCommenTitle from "../Posts/PostCommenTitle";

const UserActivityStyles = styled.div`
  .activity-tabs {
    display: flex;
    gap: 1rem;
    border-bottom: 1px solid #dee2e6;
  }
  .activity-item {
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-weight: 500;
  }
  .activity-item.active {
    color: ${(props) => props.theme.primary};
    border-bottom: 1px solid ${(props) => props.theme.primary};
  }
  .activity {
    &-comment {
      padding-top: 2rem;
      border-bottom: 1px solid ${(props) => props.theme.primary};
    }
    &-comment-info {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding-bottom: 2rem;
      &.child {
        padding-left: 6.2rem;
      }
    }
    &-comment-avatar {
      width: 4.2rem;
      height: 4.2rem;
      overflow: hidden;
      position: relative;
      margin-right: 1.2rem;
      border-radius: 50%;
      img {
        width: 100%;
        display: block;
        height: 100%;
        object-fit: cover;
        border-radius: inherit;
      }
    }
  }
  .comment {
    flex-grow: 1;
    padding: 1.2rem 1.5rem;
    background: #f7f7f7;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    &-meta {
      display: flex;
      color: #888;
      margin-bottom: 3px;
      font-size: 12px;
      h4 {
        color: #555;
      }
      h4:after {
        font-weight: 400;
        content: "-";
        padding: 0 3px 0 5px;
      }
    }
  }
  .seen {
    &-article {
      margin-left: 1rem;
      padding-top: 2rem;
      display: grid;
      grid-template-columns: 0.2fr 0.8fr;
      label {
        display: flex;
        align-items: center;
        width: 11rem;
        height: 3rem;
        font-size: 1.2rem;
        color: #fff;
        font-weight: 400;
        background: ${(props) => props.theme.primary};
        position: relative;
        padding: 0.5rem 1rem;
        margin: 0 1rem 0 0;
      }
      label::after {
        content: "";
        width: 0;
        height: 0;
        border-top: 1.6rem solid transparent;
        border-left: 1rem solid ${(props) => props.theme.primary};
        border-bottom: 1.4rem solid transparent;
        position: absolute;
        right: -1rem;
        top: 0;
      }
    }
  }
  .article {
    &-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
    &-img {
      height: 10rem;
      width: 100%;
      margin-bottom: 0.8rem;
      object-fit: cover;
      display: block;
      border-radius: 1rem;
    }
    &-title {
      font-size: 1.4rem;
      line-height: 2rem;
      color: #333;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    &-meta {
      font-size: 12px;
      color: #888;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        svg {
          width: 2rem;
        }
      }
    }
  }
`;
const UserActivity = () => {
  const [toogleActivity, settoogleActivity] = useState(1);
  //   const [CommentChild, setCommentChild] = useState({});
  const [CommentList, setCommentList] = useState([]);
  const [PostSeenList, setPostSeenList] = useState([]);
  const { userInfo } = useAuth();
  useEffect(() => {
    async function getData() {
      if (userInfo?.uid) {
        const q = query(
          collection(db, "comments"),
          where("userId", "==", userInfo?.uid),
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
    }
    getData();
  }, [userInfo?.uid]);
  useEffect(() => {
    async function getData() {
      if (userInfo?.uid) {
        const q = query(
          collection(db, "postSeen"),
          where("userId", "==", userInfo?.uid),
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
          setPostSeenList(results);
        });
      }
    }
    getData();
  }, [userInfo?.uid]);
  return (
    <UserActivityStyles>
      <ul className="activity-tabs">
        <li
          className={`activity-item ${toogleActivity === 1 ? "active" : ""}`}
          onClick={() => settoogleActivity(1)}>
          Bình luận và trả lời
        </li>
        <li
          className={`activity-item ${toogleActivity === 2 ? "active" : ""}`}
          onClick={() => settoogleActivity(2)}>
          Đọc / Xem
        </li>
      </ul>
      <div className="activity-content">
        <div className={`content ${toogleActivity === 1 ? "active" : ""}`}>
          {CommentList.length > 0 &&
            CommentList.map((item) => (
              <div className="activity-comment" key={item.id}>
                <PostCommenTitle
                  postId={item?.postId}
                  data={item}
                  to={item.lug}></PostCommenTitle>
                {item.parentId !== "" ? (
                  <ActivityCommentItem
                    className="child"
                    data={item}></ActivityCommentItem>
                ) : (
                  <ActivityCommentItem data={item}></ActivityCommentItem>
                )}
              </div>
            ))}
        </div>
        <div className={`content ${toogleActivity === 2 ? "active" : ""}`}>
          {PostSeenList.length > 0 &&
            PostSeenList.map((post, index) =>
              PostSeenList[index]?.createdAT?.toDate()?.getMonth() + 1 !==
                PostSeenList[index - 1]?.createdAT?.toDate()?.getMonth() + 1 ||
              PostSeenList[index]?.createdAT?.toDate()?.getFullYear() !==
                PostSeenList[index - 1]?.createdAT?.toDate()?.getFullYear() ? (
                <div className="seen-article" key={post?.id}>
                  <label>
                    Tháng {post?.createdAT?.toDate()?.getMonth() + 1},
                    {post?.createdAT?.toDate()?.getFullYear()}
                  </label>
                  <div className="article-list">
                    {PostSeenList.length > 0 &&
                      PostSeenList.filter(
                        (item) =>
                          item?.createdAT?.toDate()?.getMonth() + 1 ===
                            post?.createdAT?.toDate()?.getMonth() + 1 &&
                          item?.createdAT?.toDate()?.getFullYear() ===
                            post?.createdAT?.toDate()?.getFullYear()
                      ).map((postMonth) => (
                        <ActivitySeenArticleItem
                          data={postMonth}
                          key={postMonth?.id}></ActivitySeenArticleItem>
                      ))}
                  </div>
                </div>
              ) : (
                ""
              )
            )}
        </div>
      </div>
    </UserActivityStyles>
  );
};

export default UserActivity;

const ActivityCommentItem = ({ className = "", data = "" }) => {
  const { user } = useUser(data.userId);
  if (!data) return;
  return (
    <div className={`activity-comment-info ${className || ""}`}>
      <div className="activity-comment-avatar">
        <img src={user?.avatar || "/avartar.png"} alt="" />
      </div>
      <div className="comment">
        <div className="comment-meta">
          <h4>{user?.fullname}</h4>
          <time>
            {new Date(data?.createdAT?.toDate()).toLocaleDateString("vi-VI")}
          </time>
        </div>
        <div className="comment-desc">{data?.comment}</div>
      </div>
    </div>
  );
};
const ActivitySeenArticleItem = ({ data = "" }) => {
  const [Post, setPost] = useState({});
  useEffect(() => {
    async function getData() {
      const docRef = doc(db, "post", data?.postId);
      const snapshot = await getDoc(docRef);
      if (snapshot.data()) {
        setPost(snapshot.data());
      }
    }
    getData();
  }, [data?.postId]);
  const [CommentList, setCommentList] = useState({});
  useEffect(() => {
    async function getData() {
      const q = query(
        collection(db, "comments"),
        where("postId", "==", data?.postId)
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
  }, [data?.postId]);
  if (!data) return;
  return (
    <article className="article-item">
      <Link to={`/${Post?.slug}`}>
        <img src={Post?.image} alt="" className="article-img" />
      </Link>
      <h2 className="article-title">
        <Link to={`/${Post?.slug}`}>{Post?.title}</Link>
      </h2>
      <div className="article-meta">
        <span className="time">
          {new Date(data?.createdAT?.toDate())?.toLocaleDateString("vi-VI")}
        </span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
            />
          </svg>
          {CommentList?.length || 0}
        </span>
      </div>
    </article>
  );
};
