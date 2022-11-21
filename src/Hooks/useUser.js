import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../Firebase/Firebase-config";

export default function useUser(userId = "") {
  const [user, setuser] = useState({});
  useEffect(() => {
    async function getDate() {
      if(!userId) return null;
      const docRef = doc(db, "users", userId);
      const snapshot = await getDoc(docRef);
      if (snapshot.data()) {
        setuser(snapshot.data());
      }
    }
    getDate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {
    user
  };
}
