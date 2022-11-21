import React from "react";
import { useForm } from "react-hook-form";
import Button from "../../Components/Button/Button";
import Field from "../../Components/Field/Field";
import ImageUpload from "../../Components/Image/ImageUpload";
import Input from "../../Components/Input/Input";
import DashBoardHeading from "../DashBoard/DashBoardHeading";
import Lable from "../../Components/lable/Lable";
import styled from "styled-components";

const UserProfileStyles = styled.div`
  .user-image {
    margin-bottom: 3rem;
  }
`;
const UserProfile = () => {
  const { control } = useForm({
    mode: "onChange",
  });
  return (
    <UserProfileStyles>
      <DashBoardHeading
        title="Acoount information"
        desc="update your account information"></DashBoardHeading>
      <form>
        <div className="user-image">
          <ImageUpload></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Lable>Fullname</Lable>
            <Input
              control={control}
              name="fullname"
              placeholder="Enter your fullname"></Input>
          </Field>
          <Field>
            <Lable>Username</Lable>
            <Input
              control={control}
              name="username"
              placeholder="Enter your username"></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Lable>Date of Birth</Lable>
            <Input
              control={control}
              name="birthday"
              placeholder="dd/mm/yyyy"></Input>
          </Field>
          <Field>
            <Lable>Mobile Number</Lable>
            <Input
              control={control}
              name="phone"
              placeholder="Enter your phone number"></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Lable>Email</Lable>
            <Input
              control={control}
              name="email"
              type="email"
              placeholder="Enter your email address"></Input>
          </Field>
          <Field></Field>
        </div>
        <div className="form-layout">
          <Field>
            <Lable>New Password</Lable>
            <Input
              control={control}
              name="password"
              type="password"
              placeholder="Enter your password"></Input>
          </Field>
          <Field>
            <Lable>Confirm Password</Lable>
            <Input
              control={control}
              name="confirmPassword"
              type="password"
              placeholder="Enter your confirm password"></Input>
          </Field>
        </div>
        <Button style={{ margin: "0 auto" ,minWidth: "20rem" }}> 
          Update
        </Button>
      </form>
    </UserProfileStyles>
  );
};

export default UserProfile;
