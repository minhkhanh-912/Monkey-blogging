import React, { useState } from "react";
import { useEffect } from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import Field from "../Components/Field/Field";
import Input from "../Components/Input/Input";
import Lable from "../Components/lable/Lable";
import { useAuth } from "../contexts/Auth-Context";
import AuthPage from "./AuthPage";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import IconEyeClose from "../Components/icon/IconEyeClose";
import IconEyeOpen from "../Components/icon/IconEyeOpen";
import Button from "../Components/Button/Button";
import { toast } from "react-toastify";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../Firebase/Firebase-config";
import InputPassword from "../Components/Input/InputPassword";
import { GoogleButton } from "react-google-button";

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(8, "Vui long nhap toi thieu 8 ky tu").required(),
  })
  .required();

const SignInPage = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  useEffect(() => {
    const arrErrors = Object.values(errors);
    if (arrErrors.length > 0) {
      toast.error(arrErrors[0].message, {
        delay: 100,
        pauseOnHover: false,
      });
    }
  }, [errors]);
  const { userInfo } = useAuth();
  useEffect(() => {
    document.title = "Login Page";
    if (userInfo?.email) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);
  const handleSignIn = async (values) => {
    if (!isValid) return;
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate("/");
      toast.success("dang nhap thanh cong");
    } catch (error) {
      toast.success(error.message);
    }
  };
  const handleSignInGoole = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(auth);
  return (
    <AuthPage>
      <form className="form" onSubmit={handleSubmit(handleSignIn)}>
        <Field>
          <Lable htmlFor="email">Email</Lable>
          <Input
            type="email"
            name="email"
            placeholder="Vui lòng nhập email"
            control={control}></Input>
        </Field>
        <Field>
          <Lable htmlFor="password">Mật khẩu</Lable>
          <InputPassword name="password" placeholder="Vui lòng nhập Mật khẩu" control={control}></InputPassword>
        </Field>
        <div className="have-account">
          Bạn chưa có tài khoản ? <NavLink to="/sign-up">Đăng Ký</NavLink>
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
          Đăng nhập
        </Button>
        <GoogleButton
          style={{ margin: "2rem auto", width: "100% !important" }}
          onClick={handleSignInGoole}
        />
      </form>
    </AuthPage>
  );
};

export default SignInPage;
