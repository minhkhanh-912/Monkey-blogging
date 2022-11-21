import { signOut } from "firebase/auth";
import React from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../contexts/Auth-Context";
import { auth } from "../../Firebase/Firebase-config";
import { userRole } from "../../utils/constants";
import Button from "../Button/Button";
import Input from "../Input/Input";
import HeaderBanner from "./HeaderBanner";
import HeaderBottom from "./HeaderBottom";
import HeaderTop from "./HeaderTop";

const HeaderStyles = styled.div`
  /* padding: 0 0 2rem; */
  .header-main {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  .menu-left {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  .menu-right {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-left: auto;
  }
  @media screen and (max-width: 1023.98px) {
    .menu,
    .search {
      display: none;
    }
    .header-banner {
      width: 70%;
    }
    .header-footer {
      display: none;
    }
  }
  @media screen and (max-width: 767.98px) {
    .header-main {
      padding: 0 !important;
      /* gap: 0; */
    }
    .menu-item {
      padding-right: 1rem;
    }
    .header-button {
      max-width: 10rem !important;
      font-size: 1.2rem;
    }
    .menu-left .menu-item{
      display: none;
    }
    .menu-item.menu-mobile{
      display: block  !important;
      padding-left: 1rem;
      span{
        display: none;
      }
    }
    .menu-item.mobile span{
      display: none;
    }
  }
  @media screen and (min-width: 1024px) {
    padding: 0 0 2rem;
  }
  .header-auth {
    width: 5rem;
    height: 5rem;
    border-radius: 100%;
    position: relative;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 100%;
    }
    &-icon {
      display: block;
      width: 2rem;
      height: 2rem;
      padding: 0.5rem;
      background: #ccc;
      border-radius: 100%;
      border: 1px solid white;
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
      position: absolute;
      bottom: 0;
      right: 0;
      transform: translateY(50%);
      svg {
        width: 1rem;
        height: 1rem;
      }
    }
  }
`;
const Header = () => {
  return (
    <HeaderStyles>
      <HeaderTop></HeaderTop>
      <HeaderBanner></HeaderBanner>
      <HeaderBottom></HeaderBottom>
    </HeaderStyles>
  );
};

export default Header;
