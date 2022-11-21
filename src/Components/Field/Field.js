import React from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";

const FieldStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 1rem;
  margin-bottom: 3rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Field = ({ children }) => {
  return <FieldStyles>{children}</FieldStyles>;
};

Field.propTypes = {
  children: PropTypes.node,
};

export default Field;
