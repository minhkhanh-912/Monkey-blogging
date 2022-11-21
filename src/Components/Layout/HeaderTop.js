import { signOut } from "firebase/auth";
import React from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/Auth-Context";
import { auth } from "../../Firebase/Firebase-config";
import { userRole } from "../../utils/constants";
import Button from "../Button/Button";

const HeaderTopStyles = styled.div`
  padding: 1rem 0;
  background-color: #1d1d1d;
  color: #999;
  font-size: 1.4rem;
  .menu-item {
    display: flex;
    gap: 0.5rem;
    svg {
      width: 2rem;
    }
  }
`;
const HeaderTop = () => {
  const { userInfo } = useAuth();
  const handleOutSide = () => {
    signOut(auth);
  };
  const date = new Date();
  return (
    <HeaderTopStyles>
      <div className="container">
        <div className="header-main">
          <ul className="menu-left">
            <li className="menu-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <span>bmkhanh912@gmail.com</span>
            </li>
            <li className="menu-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeidth="1.5"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              <span>0395936434</span>
            </li>
          </ul>
          <div className="menu-right">{`${date}`}</div>
        </div>
      </div>
    </HeaderTopStyles>
  );
};

export default HeaderTop;
