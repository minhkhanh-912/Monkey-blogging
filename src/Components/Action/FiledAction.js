import React from "react";
import styled from "styled-components";

const FiledActionStyles = styled.div`
  color: ${(props) => props.theme.grayDark};
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const FiledAction = ({ children }) => {
  return <FiledActionStyles>{children}</FiledActionStyles>;
};

export default FiledAction;
