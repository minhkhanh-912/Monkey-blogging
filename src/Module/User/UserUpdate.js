import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { number } from "prop-types";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { useAuth } from "../../contexts/Auth-Context";
import { db } from "../../Firebase/Firebase-config";
import useUploadImage from "../../Hooks/useUploadImage";
import { gender, userRole, userStatus } from "../../utils/constants";
import DashBoardHeading from "../DashBoard/DashBoardHeading";

const UserUpdateStyles = styled.div`
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
const UserUpdate = () => {
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
      password: "",
      avatar: "",
      status: userStatus.Active,
      role: userRole.user,
      createdAT: new Date(),
    },
  });
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const UserId = params.get("id");
  const WatchStatus = watch("status");
  const WatchRole = watch("role");
  const WatchGender = watch("gender");
  const imageUrl = getValues("avatar");
  const RegexImage = /%2F(\S+)\?/gm.exec(imageUrl);
  const image_name = RegexImage?.length > 0 ? RegexImage[1] : "";
  const {
    image,
    setimage,
    handlereset,
    progress,
    selectValueImage,
    handleDeleteImage,
  } = useUploadImage(setValue, getValues, image_name, deleteimage);
  async function deleteimage() {
    const colRef = doc(db, "users", UserId);
    await updateDoc(colRef, {
      avatar: "",
    });
  }
  useEffect(() => {
    setimage(imageUrl);
  }, [imageUrl, setimage]);
  useEffect(() => {
    async function fakeData() {
      const colRef = doc(db, "users", UserId);
      await onSnapshot(colRef, (doc) => {
        reset(doc.data());
      });
    }
    fakeData();
  }, [UserId, reset]);
  const handleUpdateuser = async (values) => {
    try {
      const cloneValues = { ...values };
      console.log(cloneValues);
      cloneValues.status = Number(cloneValues.status);
      cloneValues.role = Number(cloneValues.role);
      const colRef = doc(db, "users", UserId);
      await updateDoc(colRef, {
        ...cloneValues,
        avatar: image,
        createdAT: serverTimestamp(),
      });
      toast.success("cap nhat nguoi dung thanh cong!");
      navigate("/manage/user");
    } catch (error) {
      console.log(error);
      toast.error("cap nhat nguoi dung  khong thanh cong!");
    }
  };
  const { userInfo } = useAuth();
  console.log(userInfo);
  return (
    <UserUpdateStyles>
      <DashBoardHeading
        title="Update user"
        desc="Update your user to system"></DashBoardHeading>
      <form onSubmit={handleSubmit(handleUpdateuser)}>
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
        {userInfo?.role === userRole.ADMIN ? (
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
        ) : (
          ""
        )}
        <Button
          type="submit"
          style={{ margin: "0 auto", minWidth: "20rem" }}
          isloading={isSubmitting}
          disable={isSubmitting}>
          Update user
        </Button>
      </form>
    </UserUpdateStyles>
  );
};

export default UserUpdate;
