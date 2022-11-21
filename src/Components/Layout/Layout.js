import React from "react";
import BackTop from "../BackTop/BackTop";
import MainColors from "../Colors/MainColors";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header></Header>
      <MainColors></MainColors>
      {children}
      <BackTop></BackTop>
      <Footer></Footer>
    </>
  );
};

export default Layout;
