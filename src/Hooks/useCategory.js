import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../Firebase/Firebase-config";

export default function useCategory(categoryId = "") {
    const [category , setcategory] = useState({});
    useEffect(()=>{
      async function getDate(){
        if(!categoryId) return null;
        const docRef = doc(db , "category" , categoryId);
        const snapshot = await getDoc(docRef);
        if(snapshot.data()){
          setcategory(snapshot.data());
        }
      };
      getDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
  return {
    category
  };
}
