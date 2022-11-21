import { async } from "@firebase/util";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import Button from "../../Components/Button/Button";
import Radio from "../../Components/Checkbox/Radio";
import Field from "../../Components/Field/Field";
import ImageUpload from "../../Components/Image/ImageUpload";
import Input from "../../Components/Input/Input";
import InputPassword from "../../Components/Input/InputPassword";
import Lable from "../../Components/lable/Lable";
import TextArea from "../../Components/TextArea/TextArea";
import { auth, db } from "../../Firebase/Firebase-config";
import useUploadImage from "../../Hooks/useUploadImage";
import { gender, userRole, userStatus } from "../../utils/constants";
import DashBoardHeading from "../DashBoard/DashBoardHeading";

const UserAddnewStyled = styled.div`
  .user-image {
    width: 20rem;
    height: 20rem;
    margin-left: auto;
    margin-right: auto;
    border-radius: 100%;
    margin-bottom: 2rem;
  }
  .image {
    border-radius: 100%;
  }
`;
const UserAddnew = () => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      gender: gender.Male,
      password: "",
      description: "",
      avatar: "",
      status: userStatus.Active,
      role: userRole.user,
      createdAT: new Date(),
    },
  });
  const { image, handlereset, progress, selectValueImage, handleDeleteImage } =
    useUploadImage(setValue, getValues);
  const handleAddUser = async (values) => {
    if (!isValid) return;
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        avatar: image,
        status: Number(values.status),
        phone: values.phone,
        gender: Number(values.gender),
        description: values.description,
        role: Number(values.role),
        createdAT: serverTimestamp(),
      });
      reset({
        fullname: "",
        email: "",
        password: "",
        phone: "",
        avatar: "",
        description: "",
        gender: Number(values.Male),
        status: userStatus.Active,
        role: userRole.user,
        createdAT: new Date(),
      });
      toast.success("tao tai khoan thanh cong!");
      console.log(values);
      handlereset();
    } catch (error) {
      toast.error("tao tai khoan khong thanh cong!");
    }
  };
  const WatchStatus = watch("status");
  const WatchRole = watch("role");
  const WatchGender = watch("gender");
  return (
    <UserAddnewStyled>
      <DashBoardHeading
        title="New user"
        desc="Add new user to system"></DashBoardHeading>
      <form onSubmit={handleSubmit(handleAddUser)}>
        <div className="user-image">
          <ImageUpload
            className="image"
            image={image}
            progress={progress}
            onChange={selectValueImage}
            handleDeleteImage={handleDeleteImage}></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Lable>Fullname</Lable>
            <Input
              name="fullname"
              type="text"
              placeholder="Enter your fullname"
              control={control}></Input>
          </Field>
          <Field>
            <Lable>Email</Lable>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Lable>Phone</Lable>
            <Input
              name="phone"
              placeholder="Enter your Phone"
              control={control}
              type="text"></Input>
          </Field>
          <Field>
            <Lable>Password</Lable>
            <InputPassword
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"></InputPassword>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Lable>Gender</Lable>
            <div className="form-radios">
              <Radio
                name="gender"
                control={control}
                value={gender.Male}
                checked={Number(WatchGender) === gender.Male}>
                Male
              </Radio>
              <Radio
                name="gender"
                control={control}
                value={gender.Female}
                checked={Number(WatchGender) === gender.Female}>
                Female
              </Radio>
              <Radio
                name="gender"
                control={control}
                value={gender.other}
                checked={Number(WatchGender) === gender.other}>
                Other
              </Radio>
            </div>
          </Field>
          <Field>
            <Lable>Description</Lable>
            <TextArea name="description" control={control}></TextArea>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Lable>Status</Lable>
            <div className="form-radios">
              <Radio
                name="status"
                control={control}
                value={userStatus.Active}
                checked={Number(WatchStatus) === userStatus.Active}>
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                value={userStatus.PENDING}
                checked={Number(WatchStatus) === userStatus.PENDING}>
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                value={userStatus.BAN}
                checked={Number(WatchStatus) === userStatus.BAN}>
                Banned
              </Radio>
            </div>
          </Field>
          <Field>
            <Lable>Role</Lable>
            <div className="form-radios">
              <Radio
                name="role"
                control={control}
                value={userRole.ADMIN}
                checked={Number(WatchRole) === userRole.ADMIN}>
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                value={userRole.MOD}
                checked={Number(WatchRole) === userRole.MOD}>
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                value={userRole.user}
                checked={Number(WatchRole) === userRole.user}>
                User
              </Radio>
            </div>
          </Field>
        </div>
        <Button
          style={{ margin: "0 auto", minWidth: "20rem" }}
          isloading={isSubmitting}
          disable={isSubmitting}>
          Add new user
        </Button>
      </form>
    </UserAddnewStyled>
  );
};

export default UserAddnew;
