import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useColor } from "../../contexts/Color-Context";

const HeaderBannerStyles = styled.div`
  padding: 30px 0;
  .header-logo {
    display: block;
    width: 20rem;
    height: auto;
  }
  .logo {
    max-width: 100%;
    height: auto;
  }
  .header-banner {
    margin-left: auto;
    max-width: 100%;
    height: auto;
  }
`;
const HeaderBanner = () => {
  const { color, setcolor } = useColor();
  return (
    <HeaderBannerStyles>
      <div className="container">
        <div className="header-main">
          <Link to={"/"} className="header-logo">
            <img srcSet="/logo.png" alt="monkey-blogging" className="logo" />
          </Link>
          <img
            srcSet="/banner.png"
            alt="monkey-blogging"
            className="header-banner"
          />
        </div>
      </div>
    </HeaderBannerStyles>
  );
};

export default HeaderBanner;
