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
        <h2 className="heading">B??i vi???t</h2>
        <div className="grid-layout grid-layout--primary">
          <Link to={`/manage/post`}>
            <LableDashBoard>
              <h2>{PostList?.length || 0}</h2>
              <p>T???ng b??i vi???t</p>
            </LableDashBoard>
          </Link>
          <LableDashBoard type="success">
            <h2>
              {PostList?.filter((item) => item.status === PostStatus?.APPROVED)
                .length || 0}
            </h2>
            <p>T???ng b??i vi???t xu???t b???n</p>
          </LableDashBoard>
          <LableDashBoard type="warning">
            <h2>
              {PostList?.filter((item) => item.status === PostStatus?.Pending)
                .length || 0}
            </h2>
            <p>T???ng b??i vi???t ch??? duy???t</p>
          </LableDashBoard>
          <LableDashBoard type="danger">
            <h2>
              {PostList?.filter((item) => item.status === PostStatus?.REJECT)
                .length || 0}
            </h2>
            <p>T???ng b??i vi???t ???n</p>
          </LableDashBoard>
          <Link to={`/manage/post`}>
            <LableDashBoard>
              <p>B??i vi???t ???????c xem nhi???u nh???t</p>
            </LableDashBoard>
          </Link>
          <LableDashBoard>
            <h2>{handleSum()}</h2>
            <p>T???ng l?????ng l?????t xem b??i vi???t</p>
          </LableDashBoard>
        </div>
      </div>
      <div className="dashboard">
        <h2 className="heading">Chuy??n m???c</h2>
        <div className="grid-layout grid-layout--primary">
          <Link to={`/manage/category`}>
            <LableDashBoard>
              <h2>{CategoryList?.length || 0}</h2>
              <p>T???ng chuy??n m???c</p>
            </LableDashBoard>
          </Link>
          <LableDashBoard type="success">
            <h2>{CategoryDetailList?.length || 0}</h2>
            <p>T???ng chuy??n m???c con</p>
          </LableDashBoard>
          <LableDashBoard type="success">
            <h2>
              {CategoryList?.filter(
                (item) => item.status === categoryStatus?.APPROVED
              ).length || 0}
            </h2>
            <p>T???ng chuy??n m???c ???? duy???t</p>
          </LableDashBoard>
          <LableDashBoard type="warning">
            <h2>
              {CategoryList?.filter(
                (item) => item.status === categoryStatus?.UNAPPROVED
              ).length || 0}
            </h2>
            <p>T???ng chuy??n m???c ???n</p>
          </LableDashBoard>
        </div>
      </div>
      <div className="dashboard">
        <h2 className="heading">T??i kho???n</h2>
        <div className="grid-layout grid-layout--primary">
          <Link to={`/manage/user`}>
            <LableDashBoard>
              <h2>{UserList?.length || 0}</h2>
              <p>T???ng t??i kho???n</p>
            </LableDashBoard>
          </Link>
          <LableDashBoard type="success">
            <h2>
              {UserList?.filter((item) => item.role === userRole?.ADMIN)
                .length || 0}
            </h2>
            <p>T???ng t??i kho???n admin</p>
          </LableDashBoard>
          <LableDashBoard type="warning">
            <h2>
              {UserList?.filter((item) => item.role === userRole?.MOD).length ||
                0}
            </h2>
            <p>T???ng t??i kho???n mode</p>
          </LableDashBoard>
          <LableDashBoard type="danger">
            <h2>
              {UserList?.filter((item) => item.role === userRole?.user)
                .length || 0}
            </h2>
            <p>T???ng t??i kho???n user</p>
          </LableDashBoard>
        </div>
      </div>
    </DashBoardPageStyles>
  );
};

export default DashBoardPage;
