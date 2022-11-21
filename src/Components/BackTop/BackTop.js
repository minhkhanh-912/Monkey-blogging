import React from "react";
import { useRef } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import { useColor } from "../../contexts/Color-Context";
import { useEffect } from "react";

const BackTopStyles = styled.div`
  position: fixed;
  right: 2rem;
  bottom: 3rem;
  width: 5rem;
  height: 5rem;
  background-color: ${(props) => props.theme.primary};
  color: white;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  transition: all 0.5s linear;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.secondary};
  }
`;
const BackTop = () => {
  const { color, setcolor } = useColor();
  const nodeRef = useRef(null);
  useEffect(() => {
    function onscroll() {
      const scrollY = window?.scrollY;
      if (scrollY > 400 && nodeRef.current) {
        nodeRef.current.style.opacity = "1";
        nodeRef.current.style.visibility = "visible";
      } else {
        if(nodeRef.current){
          nodeRef.current.style.opacity = "0";
        nodeRef.current.style.visibility = "hidden";
        }
      }
    }
    window.removeEventListener("scroll",onscroll);
    window.addEventListener("scroll",onscroll);
    return ()=>window.removeEventListener("scroll",onscroll);
  }, []);
  const HandleBackTop = () => {
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return ReactDOM.createPortal(
    <BackTopStyles
      onClick={HandleBackTop}
      style={{ opacity: "0", visibility: "hidden" }}
      ref={nodeRef}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={20}
        height={20}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
        />
      </svg>
    </BackTopStyles>,
    document.querySelector("#root")
  );
};

export default BackTop;
