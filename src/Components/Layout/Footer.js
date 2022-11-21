import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { v4 } from "uuid";
import { db } from "../../Firebase/Firebase-config";

const FooterStyles = styled.footer`
  background: #fff;
  padding: 2rem 0 1.5rem;
  font-weight: 500;
  .footer-categories {
    display: flex;
    padding-bottom: 10px;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
  }
  .footer-cateList {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 0.1fr;
    li a {
      display: block;
      margin-top: 1rem;
    }
    & li {
      margin-left: auto;
      text-align: left;
      width: 100%;
      display: inline-block;
      vertical-align: top;
    }
    @media screen and (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  .footer-control {
    width: 20%;
  }
  .footer-hotline {
    color: #333;
    margin-top: 1rem;
    line-height: 1.8rem;
    text-transform: uppercase;
    &:hover {
      color: ${(props) => props.theme.primary};
    }
    span {
      color: ${(props) => props.theme.primary};
      /* font-size: 1.8rem; */
    }
  }
  .footer-follow {
    margin-top: 1.5rem;
    display: flex;
    gap: 1rem;
    a {
      width: 3.9rem;
      height: 3.9rem;
      background: url("./footer-follow.png") no-repeat;
    }
    & a.zl {
      background-position: -5.2rem 0;
    }
    & a.yt {
      background-position: -10.4rem 0;
    }
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
  .footer-info {
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      width: 2rem;
      display: inline-block;
    }
  }
  .copyright-author {
    font-weight: 600;
  }
`;
const Footer = () => {
  const [categories, setcategories] = useState([]);
  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "category");
      const q = query(colRef, where("status", "==", 1));
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
  // if (categories.length <= 0) return;
  return (
    <FooterStyles>
      <div className="container">
        <div className="footer-categories">
          <ul className="footer-cateList">
            {categories.length > 0 &&
              categories.map((item) => (
                <li key={item.id}>
                  <Link to={`/category/${item.slug}`}>{item?.name}</Link>
                </li>
              ))}
            {categories.length <= 0 &&
              new Array(12).fill(0).map(() => (
                <li key={v4()}>
                  <Skeleton width={150}></Skeleton>
                </li>
              ))}
          </ul>
          <div className="footer-control">
            <p className="footer-hotline">
              HOT LINE
              <br></br>
              <span>0395936434</span>
            </p>
            <p className="footer-hotline">
              Liên hệ quảng cáo
              <br></br>
              <span>0395936434</span>
            </p>
            <p className="footer-follow">
              <Link to="/" className="fb"></Link>
              <Link to="/" className="zl"></Link>
              <Link to="/" className="yt"></Link>
            </p>
          </div>
        </div>
        <div className="footer-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
            />
          </svg>
          &nbsp; with by &nbsp;
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="red"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          . Copyright by &nbsp;
          <span className="copyright-author">Bùi Minh Khánh &nbsp; </span>{" "}
          &copy; 2022
        </div>
      </div>
    </FooterStyles>
  );
};

export default Footer;
