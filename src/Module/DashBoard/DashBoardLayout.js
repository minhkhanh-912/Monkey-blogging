import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import DashBoardHeader from "./DashBoardHeader";
import Sidebar from "./Sidebar";
import NotFoundPage from "../../Pages/NotFoundPage";
import { useAuth } from "../../contexts/Auth-Context";
const DashBoardLayoutStyles = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  .dashboard {
    &-main {
      display: grid;
      grid-template-columns: 30rem minmax(0, 1fr);
      padding: 4rem 2rem;
      gap: 0 4rem;
    }
    &-heading {
      font-weight: bold;
      font-size: 3rem;
      color: ${(props) => props.theme.primary};
      letter-spacing: 1px;
    }
    &-desc {
      color: ${(props) => props.theme.gray80};
    }
    @media screen and (max-width: 1023.98px) {
      &-main {
        
      }
    }
    @media screen and (max-width: 768px) {
      &-main {
        gap: 0 2rem;
      }
    }
  }
`;
const DashBoardLayout = () => {
  const { userInfo } = useAuth();
  if (!userInfo) return <NotFoundPage></NotFoundPage>;
  return (
    <DashBoardLayoutStyles>
      <DashBoardHeader userInfo={userInfo}></DashBoardHeader>
      <div className="dashboard-main">
        <Sidebar></Sidebar>
        <div className="dashboard-children">
          <Outlet></Outlet>
        </div>
      </div>
    </DashBoardLayoutStyles>
  );
};

export default DashBoardLayout;
