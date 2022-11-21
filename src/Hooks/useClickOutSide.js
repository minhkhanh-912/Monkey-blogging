import { useState } from "react";
import { useEffect, useRef } from "react";

export default function useClickOutSide() {
  const Noderef = useRef(null);
  const domRef = useRef(null);
  const [show, setshow] = useState(false);
  useEffect(() => {
    function Onclick(e) {
      if (
        Noderef?.current &&
        !Noderef?.current?.contains(e.target) &&
        !domRef?.current?.contains(e.target)
      ) {
        setshow(false);
      }
    }
    document.addEventListener("click", Onclick);
    return () => document.removeEventListener("click", Onclick);
  }, []);
  return {
    show,
    setshow,
    Noderef,
    domRef,
  };
}
