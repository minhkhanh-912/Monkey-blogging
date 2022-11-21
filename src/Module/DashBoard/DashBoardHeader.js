import React from "react";
import styled from "styled-components";
import Button from "../../Components/Button/Button";
const DashboardHeaderStyles = styled.div`
  background-color: white;
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  .header-avatar {
    width: 52px;
    height: 52px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 100rem;
    }
  }
`;
const DashBoardHeader = ({userInfo=""}) => {
  return (
    <DashboardHeaderStyles>
      <Button to="/manage/add-post" className="header-button" height="52px">
        Write new post
      </Button>
      <div className="header-avatar">
        <img
          src={userInfo?.avatar || "/avartar.png"}
          alt=""
        />
      </div>
    </DashboardHeaderStyles>
  );
};

export default DashBoardHeader;
