import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { theme } from "../utils/constants";

const ColorContext = createContext();
function ColorProvider(props) {
  const [color, setcolor] = useState("#FF6F61");
  theme.primary = color;
  const value = { color, setcolor };
  return (
    <ColorContext.Provider value={value} {...props}></ColorContext.Provider>
  );
}
const useColor = () => {
  const context = useContext(ColorContext);
  if (typeof context === "undefined")
    throw new Error("useAuth musbe in AuthProvider");
  return context;
};
export { ColorProvider, useColor };
