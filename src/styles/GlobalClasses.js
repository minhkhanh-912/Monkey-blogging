import { css } from "styled-components";

export const GlobalClasses = css`
  body::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  body::-webkit-scrollbar-track {
    background-color: #fafafa;
  }

  /* Handle */
  body::-webkit-scrollbar-thumb {
    background-color: #606060;
    border-radius: 50px;
  }
  body::-webkit-scrollbar-thumb:hover {
    background-color: #838282;
  }
`;
