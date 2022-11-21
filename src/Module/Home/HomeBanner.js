import React from "react";
import styled from "styled-components";
import Button from "../../Components/Button/Button";
import { useColor } from "../../contexts/Color-Context";

const HomebannerStyles = styled.div`
  font-family: "Montserrat", sans-serif;
  .container {
    min-height: 52rem;
    background-image: linear-gradient(
      to bottom right,
      ${(props) => props.theme.primary},
      ${(props) => props.theme.secondary}
    );
    padding: 4rem 3rem;
    margin-bottom: 6rem;
  }
  .banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-content {
      max-width: 60rem;
      color: white;
    }
    &-heding {
      font-size: 3.6rem;
      margin-bottom: 2rem;
    }
    &-desc {
      line-height: 1.75;
      margin-bottom: 4rem;
    }
  }
  @media screen and (max-width: 1023.98px) {
    .banner {
      flex-direction: column;
      min-height: unset;
      &-button {
        height: auto;
        padding: 1.5rem;
      }
    }
  }
`;

const HomeBanner = () => {
  const { color, setcolor } = useColor();
  return (
    <HomebannerStyles>
      <div className="container">
        <div className="banner">
          <div className="banner-content">
            <h1 className="banner-heding">Monkey Blogging</h1>
            <p className="banner-desc">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim ex
              deleniti quae voluptatibus necessitatibus doloremque, officia
              debitis quos voluptatem sapiente at dicta voluptatum consequatur
              cum earum, placeat sunt! Vitae, nisi.
            </p>
            <Button to="/sign-in" bg="secondary" className="banner-button">
              Get Started
            </Button>
          </div>
          <div className="banner-img">
            <img src="/BannerMain.png" alt="Banner" />
          </div>
        </div>
      </div>
    </HomebannerStyles>
  );
};

export default HomeBanner;
