import React from "react";
import styled from "styled-components";
const TableStyles = styled.div`
  overflow-x: auto;
  background-color: white;
  border-radius: 1rem;
  table {
    width: 100%;
  }
  thead {
    background-color: #f7f7f8;
  }
  th,
  td {
    vertical-align: middle;
    border-bottom: 1px solid #f7f7f8;
  }
  th {
    padding: 2rem 3rem;
    font-weight: 600;
    text-align: left;
  }
  td {
    padding: 1rem 2rem;
  }
  tbody {
  }
  @media screen and (max-width: 1023.98px) {
    td:nth-child(2),
    th:nth-child(2) {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 10;
      min-width: 150px;
      border-right: 1px solid #f7f7f8;
    }
    td:nth-child(2) {
      background-color: white;
    }
    th:nth-child(2) {
      background-color: #f7f7f8;
    }
  }
`;
const Table = ({ children }) => {
  return (
    <TableStyles>
      <table>{children}</table>
    </TableStyles>
  );
};

export default Table;
