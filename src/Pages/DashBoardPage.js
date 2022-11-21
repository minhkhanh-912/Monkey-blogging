import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import LableDashBoard from "../Components/lable/LableDashBoard";
import { useAuth } from "../contexts/Auth-Context";
import { db } from "../Firebase/Firebase-config";
import DashBoardHeading from "../Module/DashBoard/DashBoardHeading";
import {
  categoryStatus,
  PostStatus,
  userRole,
  userStatus,
} from "../utils/constants";
import NotFoundPage from "./NotFoundPage";

const DashBoardPageStyles = styled.div`
  .dashboard {
    margin-bottom: 3rem;
  }
  .heading {
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: ${(props) => props.theme.gray80};
  }
`;
const DashBoardPage = () => {
  const [CategoryList, setCategoryList] = useState([]);
  const [CategoryDetailList, setCategoryDetailList] = useState([]);
  const [PostList, setPostList] = useState([]);
  const [UserList, setUserList] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "category");
    onSnapshot(colRef, async (snapshot) => {
      let results = [];
      snapshot.docs.forEach((item) => {
        results.push({
          id: item.id,
          ...item.data(),
        });
      });
      setCategoryList(results);
    });
  }, []);
  useEffect(() => {
    const colRef = collection(db, "categoryDetail");
    onSnapshot(colRef, async (snapshot) => {
      let results = [];
      snapshot.docs.forEach((item) => {
        results.push({
          id: item.id,
          ...item.data(),
        });
      });
      setCategoryDetailList(results);
    });
  }, []);
  useEffect(() => {
    const colRef = collection(db, "post");
    onSnapshot(colRef, async (snapshot) => {
      let results = [];
      snapshot.docs.forEach((item) => {
        results.push({
          id: item.id,
          ...item.data(),
        });
      });
      setPostList(results);
    });
  }, []);
  useEffect(() => {
    const colRef = collection(db, "users");
    onSnapshot(colRef, async (snapshot) => {
      let results = [];
      snapshot.docs.forEach((item) => {
        results.push({
          id: item.id,
          ...item.data(),
        });
      });
      setUserList(results);
    });
  }, []);
  let sum = 0;
  const handleSum = () => {
    PostList?.length > 0 && PostList.map((item) => (sum += item.view));
    return sum;
  };
  useEffect(() => {
    document.title = `ADMIN`;
  }, [CategoryList?.name]);
  return (
    <DashBoardPageStyles>
      <div className="dashboard">
        <h2 className="heading">Bài viết</h2>
        <div className="grid-layout grid-layout--primary">
          <Link to={`/manage/post`}>
            <LableDashBoard>
              <h2>{PostList?.length || 0}</h2>
              <p>Tổng bài viết</p>
            </LableDashBoard>
          </Link>
          <LableDashBoard type="success">
            <h2>
              {PostList?.filter((item) => item.status === PostStatus?.APPROVED)
                .length || 0}
            </h2>
            <p>Tổng bài viết xuất bản</p>
          </LableDashBoard>
          <LableDashBoard type="warning">
            <h2>
              {PostList?.filter((item) => item.status === PostStatus?.Pending)
                .length || 0}
            </h2>
            <p>Tổng bài viết chờ duyệt</p>
          </LableDashBoard>
          <LableDashBoard type="danger">
            <h2>
              {PostList?.filter((item) => item.status === PostStatus?.REJECT)
                .length || 0}
            </h2>
            <p>Tổng bài viết ẩn</p>
          </LableDashBoard>
          <Link to={`/manage/post`}>
            <LableDashBoard>
              <p>Bài viết được xem nhiều nhất</p>
            </LableDashBoard>
          </Link>
          <LableDashBoard>
            <h2>{handleSum()}</h2>
            <p>Tổng lượng lượt xem bài viết</p>
          </LableDashBoard>
        </div>
      </div>
      <div className="dashboard">
        <h2 className="heading">Chuyên mục</h2>
        <div className="grid-layout grid-layout--primary">
          <Link to={`/manage/category`}>
            <LableDashBoard>
              <h2>{CategoryList?.length || 0}</h2>
              <p>Tổng chuyên mục</p>
            </LableDashBoard>
          </Link>
          <LableDashBoard type="success">
            <h2>{CategoryDetailList?.length || 0}</h2>
            <p>Tổng chuyên mục con</p>
          </LableDashBoard>
          <LableDashBoard type="success">
            <h2>
              {CategoryList?.filter(
                (item) => item.status === categoryStatus?.APPROVED
              ).length || 0}
            </h2>
            <p>Tổng chuyên mục đã duyệt</p>
          </LableDashBoard>
          <LableDashBoard type="warning">
            <h2>
              {CategoryList?.filter(
                (item) => item.status === categoryStatus?.UNAPPROVED
              ).length || 0}
            </h2>
            <p>Tổng chuyên mục ẩn</p>
          </LableDashBoard>
        </div>
      </div>
      <div className="dashboard">
        <h2 className="heading">Tài khoản</h2>
        <div className="grid-layout grid-layout--primary">
          <Link to={`/manage/user`}>
            <LableDashBoard>
              <h2>{UserList?.length || 0}</h2>
              <p>Tổng tài khoản</p>
            </LableDashBoard>
          </Link>
          <LableDashBoard type="success">
            <h2>
              {UserList?.filter((item) => item.role === userRole?.ADMIN)
                .length || 0}
            </h2>
            <p>Tổng tài khoản admin</p>
          </LableDashBoard>
          <LableDashBoard type="warning">
            <h2>
              {UserList?.filter((item) => item.role === userRole?.MOD).length ||
                0}
            </h2>
            <p>Tổng tài khoản mode</p>
          </LableDashBoard>
          <LableDashBoard type="danger">
            <h2>
              {UserList?.filter((item) => item.role === userRole?.user)
                .length || 0}
            </h2>
            <p>Tổng tài khoản user</p>
          </LableDashBoard>
        </div>
      </div>
    </DashBoardPageStyles>
  );
};

export default DashBoardPage;
