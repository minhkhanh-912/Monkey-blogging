import { signOut } from "firebase/auth";
import React from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import { useAuth } from "../../contexts/Auth-Context";
import { auth } from "../../Firebase/Firebase-config";

const SidebarStyles = styled.div`
  width: 30rem;
  background: #ffffff;
  box-shadow: 1rem 1rem 2rem rgba(218, 213, 213, 0.15);
  border-radius: 1.2rem;
  .sidebar-logo {
    display: flex;
    align-items: center;
    font-weight: 600;
    gap: 0 2rem;
    img {
      min-width: 4rem;
    }
    margin-bottom: 2rem;
    padding: 2rem 2rem 0;
  }
  .menu-item {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 1.4rem 2rem;
    font-weight: 500;
    color: ${(props) => props.theme.gray80};
    margin-bottom: 2rem;
    cursor: pointer;
    &.active,
    &:hover {
      background: #f1fbf7;
      color: ${(props) => props.theme.primary};
    }
    &.menu-item-child {
      padding: 1.4rem 3rem;
      margin-bottom: 0;
    }
  }
  .menu-icon {
    width: 2.5rem;
    height: 2.5rem;
  }
  .menu-icon.menu-icon-Right {
    margin-left: auto;
  }
  .menu-child {
    margin-bottom: 2rem;
    transition: all 0.3s linear;
    z-index: 2;
    ${(props) =>
      props.show === "primary" &&
      css`
        height: 10rem;
      `};
    ${(props) =>
      props.show === "secondary" &&
      css`
        height: 0;
        overflow: hidden;
        margin-bottom: 0;
      `};
  }
`;
const sidebarLinks = [
  {
    id: 1,
    title: "Dashboard",
    url: "/dashboard",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Post",
    url: "/manage/post",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Category",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      </svg>
    ),
    iconClose: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    ),
    iconOpen: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
    ),
    itemChild: [
      {
        id: 10,
        title: "Categories",
        url: "/manage/category",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        ),
      },
      {
        id: 11,
        title: "Category detail",
        url: "/manage/categoryDetail",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        ),
      },
    ],
  },
  {
    id: 4,
    title: "User",
    url: "/manage/user",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    id: 5,
    title: "Logout",
    url: "/",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    ),
    onClick: () => {
      signOut(auth);
    },
  },
];
const Sidebar = () => {
  const [show, setshow] = useState(false);
  const { userInfo } = useAuth();
  return (
    <SidebarStyles className="sidebar" show={show ? "primary" : "secondary"}>
      <div className="sidebar-logo">
        <img srcSet="/logo.png 2x" alt="" />
      </div>
      {sidebarLinks.map((link) => {
        if (link.onClick)
          return (
            <div className="menu-item" key={link.id} onClick={link.onClick}>
              <span className="menu-icon">{link.icon}</span>
              <span className="menu-text">{link.title}</span>
            </div>
          );
        return (
          <div key={link.id}>
            {link?.url ? (
              <NavLink to={link.url} className="menu-item">
                <span className="menu-icon">{link.icon}</span>
                <span className="menu-text">{link.title}</span>
              </NavLink>
            ) : (
              <>
                <div
                  to={link.url}
                  className="menu-item menu-item-show"
                  onClick={() => setshow(!show)}>
                  <span className="menu-icon">{link.icon}</span>
                  <span className="menu-text">{link.title}</span>
                  {show ? (
                    <span className="menu-icon menu-icon-Right">
                      {link.iconOpen}
                    </span>
                  ) : (
                    <span className="menu-icon menu-icon-Right">
                      {link.iconClose}
                    </span>
                  )}
                </div>
              </>
            )}
            {link?.itemChild && (
              <div className="menu-child" key={link.id}>
                {link?.itemChild.map((item) => (
                  <NavLink
                    to={item.url}
                    className="menu-item menu-item-child"
                    key={item.id}>
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-text">{item.title}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </SidebarStyles>
  );
};

export default Sidebar;
