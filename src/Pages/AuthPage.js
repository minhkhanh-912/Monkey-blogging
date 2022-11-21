import React, { Children } from "react";
import styled from "styled-components";

const AuthPageStyles = styled.div`
  min-height: 100vh;
  padding: 4rem;
  text-align: center;
  .logo {
    margin: 0 auto;
    object-fit: cover;
    min-width: 20rem;
    margin-bottom: 5rem;
  }
  .heading {
    font-family: "Poppins";
    font-style: normal;
    font-weight: 600;
    font-size: 3rem;
    line-height: 6rem;
    text-align: center;
    color: ${(props) => props.theme.primary};
    margin-bottom: 3rem;
  }
  .form {
    max-width: 80rem;
    margin-left: auto;
    margin-right: auto;
  }
  .have-account{
    margin-bottom: 2rem;
    a{
      display: inline-block;
      font-weight: 500;
      color: ${props => props.theme.primary};;
    }
  }
`;
const AuthPage = ({children}) => {
  return (
    <AuthPageStyles>
      <div className="container">
        <img srcSet="/logo.png 3x" alt="monkey-blogging" className="logo" />
        {children}
      </div>
    </AuthPageStyles>
  );
};

export default AuthPage;
