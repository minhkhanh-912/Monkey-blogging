import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { auth, db } from "../Firebase/Firebase-config";
import { gender, userRole, userStatus } from "../utils/constants";

const authContext = createContext();
function AuthProvider(props) {
  const [userInfo, setuserInfo] = useState({});
  const value = { userInfo, setuserInfo };
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.displayName) {
        const colRef = query(
          collection(db, "users"),
          where("email", "==", user?.email)
        );
        const docsnapshot = await getDocs(colRef);
        docsnapshot.size <= 0 &&
          (await setDoc(doc(db, "users", user.uid), {
            fullname: user.displayName,
            email: user.email,
            password: "",
            avatar: "",
            gender: gender?.other,
            description: "",
            phone: "",
            status: userStatus.Active,
            role: userRole.user,
            createdAT: serverTimestamp(),
          }));
      }
      if (user?.email) {
        const colRef = query(
          collection(db, "users"),
          where("email", "==", user?.email)
        );
        onSnapshot(colRef, (snapshot) => {
          snapshot.docs.forEach((doc) => {
            setuserInfo({
              ...user,
              ...doc.data(),
            });
          });
        });
      } else {
        setuserInfo(null);
      }
    });
    return () => {
      unsub();
    };
  }, []);
  return <authContext.Provider value={value} {...props}></authContext.Provider>;
}

const useAuth = () => {
  const context = useContext(authContext);
  if (typeof context === "undefined")
    throw new Error("useAuth musbe in AuthProvider");
  return context;
};
export { AuthProvider, useAuth };
