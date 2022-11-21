import React from "react";
import styled from "styled-components";

const ImageUploadStyles = styled.label`
  width: 100%;
  height: 20rem;
  background-color: ${(props) => props.theme.grayLight};
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  &:hover .image-trash {
    visibility: visible;
    opacity: 1;
  }
  .image {
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    border-radius: inherit;
    width: 100%;
    height: 100%;
    justify-content: center;
    &-small {
      color: ${(props) => props.theme.grayLight};
      width: 8rem;
      height: 8rem;
    }
    &-large {
      color: ${(props) => props.theme.grayLight};
      width: 100%;
      height: 100%;
      border-radius: inherit;
    }
    &-line {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 0.5rem;
      background-color: ${(props) => props.theme.primary};
      transition: all 3s linear;
    }
    &-trash {
      width: 6rem;
      height: 6rem;
      background-color: white;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: red;
      cursor: pointer;
      border: none;
      position: absolute;
      z-index: 10;
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
      visibility: hidden;
      opacity: 0;
      transition: all 0.2s linear;
      svg {
        width: 2rem;
        height: 2rem;
      }
    }
  }
`;
const ImageUpload = ({
  name,
  progress = 0,
  image = "",
  className = "",
  handleDeleteImage = () => {},
  ...rest
}) => {
  return (
    <ImageUploadStyles className={className}>
      <input
        type="file"
        name={name}
        className="Input-hidden"
        onChange={() => {}}
        {...rest}
      />
      {progress !== 0 && !image && <div className="loading"></div>}
      {!image && progress === 0 && (
        <div className="image">
          <img src="/image_upload.jpg" alt="" className="image-small" />
          <h4 className="image-choose">Chon anh</h4>
        </div>
      )}
      {image && (
        <>
          <div className="image">
            <img src={image} alt="" className="image-large" />
          </div>
          <button type="button" className="image-trash" onClick={handleDeleteImage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </>
      )}
      {!image && (
        <div className="image-line" style={{ width: `${progress}%` }}></div>
      )}
    </ImageUploadStyles>
  );
};

export default ImageUpload;
