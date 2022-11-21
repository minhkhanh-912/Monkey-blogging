/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../contexts/Auth-Context";
import { auth, db } from "../../Firebase/Firebase-config";
import { userRole } from "../../utils/constants";
import Button from "../Button/Button";
import Input from "../Input/Input";
import { signOut } from "firebase/auth";
import { useRef } from "react";
import { useEffect } from "react";
import useClickOutSide from "../../Hooks/useClickOutSide";
import { useColor } from "../../contexts/Color-Context";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { orderBy } from "lodash";

const HeaderBottomStyles = styled.div`
  background-color: white;
  transition: all 0.2s linear;
  margin-bottom: 2rem;
  .header-main {
    padding: 0 3rem;
    border-bottom: 1px solid #eee;
    position: relative;
  }
  .btn-search {
    position: absolute;
    height: 100%;
    top: 50%;
    transform: translateY(-50%);
    right: 2%;
    cursor: pointer;
    border: none;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.is-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
  }
  &.is-fixed .header-main {
    display: none;
  }
  &.is-fixed .header-footer {
    background-color: ${(props) => props.theme.primary};
    color: white;
  }
  .header-show {
    position: absolute;
    inset: 0;
    top: 100%;
    padding: 1rem;
    background-color: white;
    width: 100%;
    height: 8rem;
    z-index: 10;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    form {
      height: 100%;
    }
  }
  .header-show.contact {
    background-color: ${(props) => props.theme.primary};
    color: white;
  }
  .header-show-contact {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    height: 100%;
  }
  .header-footer {
    background-color: white;
    box-shadow: 0 2px 3px rgb(0 0 0 / 10%);
    &-nav {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    }
  }
  .menu-item {
    /* height: 75px; */
    cursor: pointer;
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #eee;
    padding-right: 2rem;
    position: relative;
    svg {
      width: 2rem;
    }
  }
  .header-info {
    position: absolute;
    top: 100%;
    right: 0;
    padding: 1.5rem 2rem;
    background-color: #f7f7f7;
    border-top: 1px solid #e5e5e5;
    width: 28rem;
    z-index: 10;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    & li strong {
      font-weight: 500;
      padding: 10px 0 5px;
      display: block;
    }
    & li a {
      color: #00739f;
      display: block;
      padding: 10px 0 5px;
    }
    & li a:hover {
      text-decoration: underline;
    }
    & li:last-child {
      cursor: pointer;
      color: #00739f;
      display: block;
      padding: 10px 0 5px;
    }
    & li:last-child:hover {
      text-decoration: underline;
    }
  }
  .menu-item:last-child {
    border-right: none;
  }
  .menu-link {
    cursor: pointer;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .header-footer-nav {
    position: relative;
  }
  .header-footer-nav .nav-item:hover {
    background-color: #e5e5e5;
  }
  .header-footer-nav .nav-item {
    svg {
      width: 2rem;
    }
  }
  .header-footer-nav .nav-item:hover .submenu {
    display: block;
  }
  .menu-parent {
    padding: 0.6rem 0.8rem 0.7rem;
    display: block;
  }
  .submenu {
    display: none;
    position: absolute;
    min-width: 20rem;
    background: ${(props) => props.theme.primary};
    z-index: 3;
    a {
      color: #fff;
      padding: 1rem 1.6rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      display: block;
    }
    a:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
  .header-show.category {
    padding: 0;
  }
  .global-category-title {
    color: #fff;
    font-weight: 500;
    font-size: 1.2rem;
    font-size: 1.2rem;
    text-transform: uppercase;
    width: 24rem;
    padding: 1.1rem 2rem 1rem;
    position: relative;
    z-index: 1;
    background-color: ${(props) => props.theme.primary};
    /* border-bottom: 0.1rem solid #4898b7; */
  }
  .global-category li {
    display: flex;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    background: #eee;
  }
  .global-category li:hover .global-category-children li,
  .global-category li:hover {
    background: #ddd;
  }
  /* .global-category li:hover .global-category-title {
    background-color: ${(props) => props.theme.secondary};
  } */
  .global-category-children {
    padding: 0.9rem 2rem;
    width: 100%;
  }
  .global-category-children li {
    display: inline-block;
    padding: 0 2rem 0 0;
    border: none;
  }
  .global-category-children li a:hover {
    text-decoration: underline;
  }
  .global-category-children li a {
    font-size: 1.2rem;
    color: #111;
    text-transform: uppercase;
  }
`;
const CloseIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const HeaderBottom = () => {
  const { color, setcolor } = useColor();
  const Noderef = useRef(null);
  const {
    show: showcategory,
    setshow: setshowCategory,
    Noderef: CategoryRef,
    domRef: categoryDom,
  } = useClickOutSide();
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > Noderef.current?.clientHeight) {
        Noderef.current?.classList?.add("is-fixed");
        setshowCategory(false);
      } else {
        Noderef.current?.classList?.remove("is-fixed");
      }
    };
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line no-use-before-define
  }, []);
  const [categories, setcategories] = useState([]);
  const [categoriesDetail, setcategoriesDetail] = useState([]);
  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "category");
      const q = query(
        colRef,
        where("status", "==", 1),
        limit(14)
      );
      let results = [];
      onSnapshot(q, (Snapshot) => {
        Snapshot.docs.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setcategories(results);
      });
    }
    getData();
  }, []);
  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "categoryDetail");
      const q = query(colRef, where("status", "==", 1));
      let results = [];
      onSnapshot(q, (Snapshot) => {
        Snapshot.docs.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setcategoriesDetail(results);
      });
    }
    getData();
  }, []);
  return (
    <HeaderBottomStyles ref={Noderef}>
      <div className="header-main">
        <MenuLeft
          categories={categories}
          categoriesDetail={categoriesDetail}
          showcategory={showcategory}
          setshowCategory={setshowCategory}
          CategoryRef={CategoryRef}
          categoryDom={categoryDom}></MenuLeft>
        <MenuRight></MenuRight>
      </div>
      <MenuNav
        categories={categories}
        categoriesDetail={categoriesDetail}></MenuNav>
    </HeaderBottomStyles>
  );
};

export default HeaderBottom;

const MenuLeft = ({ categories, categoriesDetail, ...props }) => {
  const { showcategory, setshowCategory, CategoryRef, categoryDom } = {
    ...props,
  };
  const {
    show: showContact,
    setshow: setshowContact,
    Noderef: ContactRef,
    domRef: ContactDom,
  } = useClickOutSide();
  return (
    <>
      <ul className="menu-left">
        <li className="menu-item">
          <Link to="/" className="menu-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <span>TRANG CHỦ</span>
          </Link>
        </li>
        <li
          className="menu-item menu-mobile"
          ref={CategoryRef}
          onClick={() => setshowCategory(!showcategory)}>
          <div className="menu-icon">
            {showcategory ? (
              CloseIcon
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </div>
          <span>CHUYÊN MỤC</span>
        </li>
        <li
          className="menu-item"
          ref={ContactRef}
          onClick={() => setshowContact(!showContact)}>
          {showContact ? (
            CloseIcon
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          )}
          <span>LIÊN HỆ</span>
        </li>
        {showcategory && (
          <div className="header-show category" ref={categoryDom}>
            <ul className="global-category">
              {categories.length > 0 &&
                categories.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/category/${item.slug}`}
                      className="global-category-title"
                      title={item.name}>
                      {item.name}
                    </Link>
                    <ul className="global-category-children">
                      {categoriesDetail.length > 0 &&
                        categoriesDetail.map((category) => {
                          if (category.categoryId === item.id) {
                            return (
                              <li key={category.id}>
                                <Link to={`/${item.slug}/${category.slug}`}>
                                  {category?.name}
                                </Link>
                              </li>
                            );
                          }
                        })}
                    </ul>
                  </li>
                ))}
            </ul>
          </div>
        )}
        {showContact && (
          <div className="header-show contact" ref={ContactDom}>
            <div className="header-show-contact">
              <div className="menu-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
                <span>ĐẶT BÁO</span>
              </div>
              <div className="menu-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                  />
                </svg>
                <span>QUẢNG CÁO</span>
              </div>
              <div className="menu-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z"
                  />
                </svg>
                <a href="tel:+0395936434">0395936434</a>
              </div>
            </div>
          </div>
        )}
      </ul>
    </>
  );
};
const MenuRight = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm();
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const handleOutSide = () => {
    signOut(auth);
  };
  const handleSearch = (values) => {
    if (!isValid) return;
    if (values.search === "") {
      return;
    } else {
      navigate(`/Tim-kiem/?Search=${values.search}`);
    }
  };
  const {
    show: showSearch,
    setshow: setshowSearch,
    Noderef: SearchRef,
    domRef: SearchDom,
  } = useClickOutSide();
  const {
    show: showuser,
    setshow: setshowuser,
    Noderef: userRef,
    domRef: userDom,
  } = useClickOutSide();
  return (
    <>
      <div className="menu-right">
        <div
          className="menu-item mobile"
          ref={SearchRef}
          onClick={() => setshowSearch(!showSearch)}>
          {showSearch ? (
            CloseIcon
          ) : (
            <svg
              className="search-icon"
              width="18"
              height="17"
              viewBox="0 0 18 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <ellipse
                cx="7.66669"
                cy="7.05161"
                rx="6.66669"
                ry="6.05161"
                stroke="#999999"
                strokeWidth="1.5"
              />
              <path
                d="M17.0001 15.5237L15.2223 13.9099L14.3334 13.103L12.5557 11.4893"
                stroke="#999999"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M11.6665 12.2964C12.9671 12.1544 13.3706 11.8067 13.4443 10.6826"
                stroke="#999999"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
          <span>Tìm kiếm</span>
        </div>
        <div className="menu-item">
          {!userInfo ? (
            <Button
              to="/sign-in"
              type="button"
              height="5.6rem"
              style={{ maxWidth: "20rem" }}
              className="header-button">
              Đăng Nhập
            </Button>
          ) : userInfo?.role === userRole.ADMIN ||
            userInfo?.role === userRole.MOD ? (
            <Button
              to="/dashboard"
              type="button"
              height="5.6rem"
              style={{ maxWidth: "20rem" }}
              className="header-button">
              Dashboard
            </Button>
          ) : (
            <div
              className="header-auth"
              ref={userRef}
              onClick={() => setshowuser(!showuser)}>
              <img src={userInfo?.avatar || "/avartar.png"} alt="" />
              <span className="header-auth-icon">
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
              </span>
            </div>
          )}
        </div>
        {showSearch && (
          <div className="header-show" ref={SearchDom}>
            <form onSubmit={handleSubmit(handleSearch)}>
              <Input
                type="text"
                name="search"
                control={control}
                style={{ padding: "1.2rem 4rem 1.2rem 1.2rem" }}
                placeholder="Search pots..."
              />
              <button
                type="Submit"
                style={{ height: "100%" }}
                className="btn-search">
                <svg
                  className="search-icon"
                  width="18"
                  height="17"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <ellipse
                    cx="7.66669"
                    cy="7.05161"
                    rx="6.66669"
                    ry="6.05161"
                    stroke="#999999"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M17.0001 15.5237L15.2223 13.9099L14.3334 13.103L12.5557 11.4893"
                    stroke="#999999"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M11.6665 12.2964C12.9671 12.1544 13.3706 11.8067 13.4443 10.6826"
                    stroke="#999999"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        )}
        {showuser && (
          <div className="header-info" ref={userDom}>
            <ul>
              <li>
                <strong>Xin chào, {userInfo?.fullname || userInfo?.displayName}</strong>
              </li>
              <li>
                <Link to={`/user/${userInfo?.uid}`}>Thông tin cá nhân</Link>
              </li>
              <li>
                <Link to={`/user/${userInfo?.uid}`}>Đổi mật khẩu</Link>
              </li>
              <li>
                <Link to={`/user/${userInfo?.uid}`}>Hoạt động của tôi</Link>
              </li>
              <li onClick={handleOutSide}>Đăng xuất</li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
const MenuNav = ({ categories, categoriesDetail }) => {
  return (
    <div className="header-footer">
      <ul className="header-footer-nav">
        <li className="nav-item">
          <Link to={`/`} className="menu-parent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </Link>
        </li>
        {categories.length > 0 &&
          categories.map((item) => (
            <li className="nav-item" key={item.id}>
              <Link to={`/category/${item.slug}`} className="menu-parent">
                {item?.name}
              </Link>
              <ul className="submenu">
                {categoriesDetail.length > 0 &&
                  categoriesDetail.map((category) => {
                    if (category.categoryId === item.id) {
                      return (
                        <li key={category.id}>
                          <Link to={`/${item.slug}/${category.slug}`}>
                            {category?.name}
                          </Link>
                        </li>
                      );
                    }
                  })}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
};
