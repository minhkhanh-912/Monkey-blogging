import React from "react";
import styled from "styled-components";

const DashBoardHeadingStyles = styled.div`
    margin-bottom: 3rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`
const DashBoardHeading = ({title="" , desc="",children}) => {
  return (
    <DashBoardHeadingStyles>
      <div>
        <h1 className="dashboard-heading">{title}</h1>
        <p className="dashboard-desc">{desc}</p>
      </div>
      {children}
    </DashBoardHeadingStyles>
  );
};

export default DashBoardHeading;
