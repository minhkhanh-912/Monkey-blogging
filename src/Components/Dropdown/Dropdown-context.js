import { useContext, useEffect, useRef, useState } from "react";
import { createContext } from "react";

const DropdownContext = createContext();

function DropdownProvider(props) {
  const [show, setShow] = useState(false);
  const nodeRef = useRef(null);
  const domref = useRef(null);
  const toggle = () => {
    setShow(!show);
  };
  useEffect(() => {
    const handleClick = (e) => {
      if (
        nodeRef.current &&
        !nodeRef.current.contains(e.target) 
      ) {
        setShow(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  const value = { show, setShow, nodeRef, toggle };
  return (
    <DropdownContext.Provider value={value}>
      {props.children}
    </DropdownContext.Provider>
  );
}
const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (typeof context === "undefined")
    throw new Error("useDropdown must be used within DropdownProvider");
  return context;
};
export { useDropdown, DropdownProvider };
