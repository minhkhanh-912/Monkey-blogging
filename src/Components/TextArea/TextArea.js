import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";
import PropTypes from "prop-types";
const InputStyles = styled.div`
  width: 100%;
  position: relative;
  textarea {
    width: 100%;
    padding: ${(props) =>
      props.hasIcon ? "1.2rem 5rem 1.2rem 2.7rem" : "1.2rem 2.7rem"};
    font-size: 1.6rem;
    font-weight: 500;
    line-height: 3rem;
    border-radius: 0.8rem;
    background-color: ${(props) => props.theme.grayLight};
    transition: all 0.2s linear;
    border: 1px solid transparent;
  }
  textarea:focus {
    background-color: white;
    border-color: ${(props) => props.theme.primary};
  }
  textarea::-webkit-textarea-placeholder {
    color: ${(props) => props.theme.textColor};
  }
  textarea::-moz-textarea-placeholder {
    color: ${(props) => props.theme.textColor};
  }
  .textarea-icon {
    position: absolute;
    top: 50%;
    right: 2rem;
    cursor: pointer;
    transform: translateY(-50%);
  }
`;
const TextArea = ({
  type = "text",
  placeholder="",
  name = "",
  control,
  children,
  ...props
}) => {
  const { field } = useController({
    name,
    control,
    defaultValue: "",
  });
  return (
    <InputStyles>
      <textarea type={type} id={name} {...field} {...props} />
    </InputStyles>
  );
};

// TextArea.propTypes = {
//   type: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
//   control: PropTypes.object.isRequired,
//   children: PropTypes.node,
// };
export default TextArea;
