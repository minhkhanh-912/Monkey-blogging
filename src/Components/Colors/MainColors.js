import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { useColor } from "../../contexts/Color-Context";
import { theme } from "../../utils/constants";

const MainColorstyles = styled.div`
  position: fixed;
  top: 50%;
  ${props => props.show === true ? `left: 0` : `left: -25rem`};
  transform: translateY(-50%);
  transition: all 0.5s linear;
  z-index: 998;
  /* background-color: ${(props) => props.theme.primary}; */
  display: flex;
  align-items: flex-start;
  .main-colors {
    width: 25rem;
    border: 1px solid rgb(233, 233, 233);
    padding: 2rem 3rem 1.5rem 1.5rem;
    background-color: rgb(255, 255, 255);
    box-shadow: rgb(0 0 0 / 14%) 0px 9px 46px 0px,
      rgb(0 0 0 / 12%) 0px 11px 15px 0px, rgb(0 0 0 / 20%) 0px 24px 38px 0px;
    h2 {
      font-size: 1.4rem;
      margin-bottom: 1rem;
    }
  }
  .colors {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 1rem;
  }
  .color-item {
    height: 30px;
    overflow: hidden;
    cursor: pointer;
    background-color: red;
  }
  .button-color {
    padding: 1rem;
    color: rgb(255, 255, 255);
    font-size: 14px;
    font-weight: 100;
    line-height: 22px;
    text-align: center;
    cursor: pointer;
    background-color: ${(props) => props.theme.primary};
    box-shadow: rgb(0 0 0 / 14%) 10px 5px 46px 8px,
      rgb(0 0 0 / 20%) 10px 0px 26px -6px;
    svg {
      width: 2.5rem;
      height: 2.5rem;
    }
  }
`;
const MainColors = () => {
  const [show, setshow] = useState(false);
  const colors = [
    {
      id: 1,
      color: "#da0000",
    },
    {
      id: 2,
      color: "#2EBAC1",
    },
    {
      id: 3,
      color: "#179ea8",
    },
    {
      id: 4,
      color: "#82b440",
    },
    {
      id: 5,
      color: "#f69323",
    },
    {
      id: 6,
      color: "#fc5143",
    },
    {
      id: 7,
      color: "#d48b91",
    },
    {
      id: 8,
      color: "#8cbeb2",
    },
    {
      id: 9,
      color: "#00b249",
    },
    {
      id: 10,
      color: "#924cf3",
    },
  ];
  const { color, setcolor } = useColor();
  return (
    <MainColorstyles show={show}>
      <div className="main-colors">
        <h2>Main Colors</h2>
        <div className="colors">
          {colors.length > 0 &&
            colors.map((item) => (
              <div
                className="color-item"
                key={item.id}
                onClick={() => setcolor(item.color)}
                style={{ backgroundColor: `${item.color}` }}></div>
            ))}
        </div>
      </div>
      <div className="button-color" onClick={()=>setshow(!show)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
          />
        </svg>
      </div>
    </MainColorstyles>
  );
};

export default MainColors;
