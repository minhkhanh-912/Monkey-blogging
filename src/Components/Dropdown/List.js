import React from "react";
import styled from "styled-components";
import { useDropdown } from "./Dropdown-context";

const ListStyles = styled.div`
  position: absolute;
  width: 100%;
  top: 100%;
  left: 0;
  background: white;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  z-index: 2;
  height: 100%;
  min-height: 200px;
  overflow-y: auto;
`;
const List = ({ children }) => {
  const { show } = useDropdown();
  return <>{show && <ListStyles>{children}</ListStyles>}</>;
};

export default List;
