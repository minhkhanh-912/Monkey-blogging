import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../Components/Button/Button";
import Field from "../Components/Field/Field";
import IconEyeClose from "../Components/icon/IconEyeClose";
import IconEyeOpen from "../Components/icon/IconEyeOpen";
import Input from "../Components/Input/Input";
import Lable from "../Components/lable/Lable";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../Firebase/Firebase-config";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import AuthPage from "./AuthPage";
import InputPassword from "../Components/Input/InputPassword";
import slugify from "slugify";
import { gender, userRole, userStatus } from "../utils/constants";

const schema = yup
  .object({
    fullname: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8, "Vui long nhap toi thieu 8 ky tu").required(),
  })
  .required();
const SignUpPage = () => {
  let navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });
  const handleSignUp = async (values) => {
    if (!isValid) return;
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      await updateProfile(auth.currentUser, {
        displayName: values.fullname,
        photoURL: "",
      });
      // const colRef = collection(db, "users");
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        avatar: "",
        gender: gender?.other,
        description: "",
        phone: "",
        status: userStatus.Active,
        role: userRole.user,
        createdAT: serverTimestamp(),
      });
      // await addDoc(colRef, {
      //   fullname: values.fullname,
      //   email: values.email,
      //   password: values.password,
      // });
      toast.success("B???n ???? t???o t???o t??i kho???n th??nh c??ng!!!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    const arrErrors = Object.values(errors);
    if (arrErrors.length > 0) {
      toast.error(arrErrors[0].message, {
        delay: 100,
        pauseOnHover: false,
      });
    }
  }, [errors]);
  useEffect(() => {
    document.title = "Register Page";
  }, []);
  return (
    <AuthPage>
      <form className="form" onSubmit={handleSubmit(handleSignUp)}>
        <Field>
          <Lable htmlFor="fullname">H??? v?? T??n</Lable>
          <Input
            type="text"
            name="fullname"
            placeholder="Vui l??ng nh???p h??? v?? t??n"
            control={control}></Input>
        </Field>
        <Field>
          <Lable htmlFor="email">?????a ch??? Email</Lable>
          <Input
            type="text"
            name="email"
            placeholder="Vui l??ng nh???p email"
            control={control}></Input>
        </Field>
        <Field>
          <Lable htmlFor="password">M???t kh???u</Lable>
          <InputPassword name="password" placeholder="Vui l??ng nh???p m???t kh???u" control={control}></InputPassword>
        </Field>
        <div className="have-account">
          B???n ???? c?? t??i kho???n ? <NavLink to="/sign-in">????ng nh???p</NavLink>
        </div>
        <Button
          type="submit"
          style={{
            width: "100%",
            maxWidth: "25rem",
            margin: "0 auto",
          }}
          isloading={isSubmitting}
          disabled={isSubmitting}>
          ????ng k??
        </Button>
      </form>
    </AuthPage>
  );
};

export default SignUpPage;
