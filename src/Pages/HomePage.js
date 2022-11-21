import { signOut } from "firebase/auth";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/Auth-Context";
import { auth } from "../Firebase/Firebase-config";
import styled from "styled-components";
import Header from "../Components/Layout/Header";
import HomeBanner from "../Module/Home/HomeBanner";
import Layout from "../Components/Layout/Layout";
import HomeFeature from "../Module/Home/HomeFeature";
import HomeNewest from "../Module/Home/HomeNewest";
import HomCategory from "../Module/Home/HomCategory";
import { userStatus } from "../utils/constants";

const HomePageStyles = styled.div``;
const HomePage = () => {
  const { userInfo } = useAuth();
  const handleSignOut = () => {
    signOut(auth);
    toast.success("dang xuat thanhg cong");
  };
  if (userInfo?.status === userStatus.BAN) {
    toast.error("Tài khoản của bạn đã bị khóa khỏi hệ thống!");
    signOut(auth);
  }
  useEffect(() => {
    document.title =
      "Tin tức 24h mới nhất, tin nhanh, tin nóng hàng ngày | Báo Thanh Niên";
  }, []);
  return (
    <HomePageStyles>
      <Layout>
        <HomeBanner></HomeBanner>
        <HomeFeature></HomeFeature>
        <HomeNewest></HomeNewest>
        <HomCategory></HomCategory>
      </Layout>
    </HomePageStyles>
  );
};

export default HomePage;
