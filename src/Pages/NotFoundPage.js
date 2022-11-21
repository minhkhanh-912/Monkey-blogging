import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
const NotFoundPageStyles = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .logo {
    display: inline-block;
    margin-bottom: 4rem;
  }
  .heading{
    font-style: 6rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }
  .back{
    display: inline-block;
    padding: 1.5rem 2.5rem;
    background-color: ${props => props.theme.primary};
    border-radius: 1.5rem;
    font-weight: 500;
    color: white;
  }
`;
const NotFoundPage = () => {
  return (
    <NotFoundPageStyles>
      <NavLink to="/">
        <img srcSet="/logo.png 2x" alt="monkey-blogging" className="logo" />
      </NavLink>
      <h1 className="heading">Oops! Page Not Found</h1>
      <NavLink to="/">
       <div className="back">Back to Home</div>
      </NavLink>
    </NotFoundPageStyles>
  );
};

export default NotFoundPage;
