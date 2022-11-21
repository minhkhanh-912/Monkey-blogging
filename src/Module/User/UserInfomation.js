import { async } from "@firebase/util";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import Button from "../../Components/Button/Button";
import Radio from "../../Components/Checkbox/Radio";
import Field from "../../Components/Field/Field";
import ImageUpload from "../../Components/Image/ImageUpload";
import Input from "../../Components/Input/Input";
import InputPassword from "../../Components/Input/InputPassword";
import Lable from "../../Components/lable/Lable";
import Heading from "../../Components/Layout/Heading";
import Layout from "../../Components/Layout/Layout";
import TextArea from "../../Components/TextArea/TextArea";
import { useAuth } from "../../contexts/Auth-Context";
import { auth, db } from "../../Firebase/Firebase-config";
import useUploadImage from "../../Hooks/useUploadImage";
import HomePage from "../../Pages/HomePage";
import NotFoundPage from "../../Pages/NotFoundPage";
import { gender } from "../../utils/constants";
import PostCommenTitle from "../Posts/PostCommenTitle";
import UserActivity from "./UserActivity";

const UserInfomationStyles = styled.div`
  .user {
    &-overview {
      background-color: white;
      display: flex;
      padding: 2rem;
      box-shadow: 0 2px 3px rgb(0 0 0 / 10%);
      margin-bottom: 2rem;
    }
    &-avatar {
      width: 20rem;
      height: 20rem;
      margin-bottom: 0;
      overflow: hidden;
      position: relative;
      border-radius: 50%;
      margin-right: 3rem;
      box-shadow: 0 2px 3px rgb(0 0 0 / 10%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        display: block;
      }
    }
    &-desc {
      flex-grow: 1;
    }
    &-fullname {
      font-size: 2.4rem;
      line-height: 30px;
      line-height: 3rem;
      color: #333;
      font-weight: 700;
      margin: 0 6px 3px 0;
      display: flex;
      gap: 1rem;
      svg {
        width: 2rem;
        color: white;
      }
    }
    &-activity {
      margin-top: 1.5rem;
      width: 100%;
      display: flex;
    }
    &-box {
      text-align: center;
      display: table-cell;
      width: 50%;
      height: 10.8rem;
      background: #f0f0f0;
      padding: 3rem 0;
      margin-right: 2rem;
      h3 {
        font-weight: 400;
        color: #888;
        margin-bottom: 5px;
      }
      span {
        font-size: 2.4rem;
        font-weight: 700;
        color: ${(props) => props.theme.primary};
      }
    }
    &-tabs {
      margin-bottom: 3rem;
      display: flex;
      width: 100%;
      background: #fff;
      -webkit-box-shadow: 0 2px 3px rgb(0 0 0 / 10%);
      box-shadow: 0 2px 3px rgb(0 0 0 / 10%);

      .nav-tabs {
        width: 25rem;
        padding-top: 2rem;
        background: #f0f0f0;
        border: none;
        border-right: 1px solid #ddd;
        .nav-item {
          padding: 2rem 1.8rem;
          cursor: pointer;
          border: none;
          border-left: 3px solid #f0f0f0;
          border-bottom: 1px solid #ddd;
          display: flex;
          align-items: center;
          gap: 1rem;
          svg {
            width: 2rem;
          }
        }
        .nav-item.active {
          background-color: white;
          border-left: 3px solid ${(props) => props.theme.primary};
          color: ${(props) => props.theme.primary};
        }
      }
      .tabs-content {
        flex-grow: 1;
        padding: 2.5rem 2rem;
      }
      .content {
        display: none;
      }
      .content.active {
        display: block;
      }
    }
  }
`;
const UserInfomation = () => {
  const [ToggleState, setToggleState] = useState(1);
  const { userInfo } = useAuth();
  const [PostSeen, setPostSeen] = useState({});
  const [CommentList, setCommentList] = useState({});
  useEffect(() => {
    async function getData() {
      if (userInfo?.uid) {
        const q = query(
          collection(db, "comments"),
          where("userId", "==", userInfo?.uid)
        );
        await onSnapshot(q, (snapshot) => {
          let results = [];
          snapshot.docs.forEach((doc) => {
            results.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setCommentList(results);
        });
      }
    }
    getData();
  }, [userInfo?.uid]);
  useEffect(() => {
    async function getData() {
      if (userInfo?.uid) {
        const q = query(
          collection(db, "postSeen"),
          where("userId", "==", userInfo?.uid)
        );
        await onSnapshot(q, (snapshot) => {
          let results = [];
          snapshot.docs.forEach((doc) => {
            results.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setPostSeen(results);
        });
      }
    }
    getData();
  }, [userInfo?.uid]);
  const toggleTab = (index) => {
    setToggleState(index);
  };
  const getActiveClass = (index, className) =>
    ToggleState === index ? className : "";
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
      avatar: "",
    },
  });
  const imageUrl = userInfo?.avatar;
  const RegexImage = /%2F(\S+)\?/gm.exec(imageUrl);
  const image_name = RegexImage?.length > 0 ? RegexImage[1] : "";
  const {
    image,
    setimage,
    handlereset,
    progress,
    selectValueImage,
    handleDeleteImage,
  } = useUploadImage(
    setValue,
    getValues,
    image_name,
    deleteimage,
    uploadDatabase
  );
  async function deleteimage() {
    const colRef = doc(db, "users", userInfo?.uid);
    await updateDoc(colRef, {
      avatar: "",
    });
  }
  async function uploadDatabase(downloadURL) {
    const colRef = doc(db, "users", userInfo?.uid);
    await updateDoc(colRef, {
      avatar: downloadURL,
    });
  }
  useEffect(() => {
    setimage(imageUrl);
  }, [imageUrl, setimage]);
  if (!userInfo) return <HomePage></HomePage>;
  return (
    <UserInfomationStyles>
      <Layout>
        <div className="container">
          <Heading>THÔNG TIN CÁ NHÂN</Heading>
          <div className="user-overview">
            <div className="user-avatar">
              <form action="">
                <ImageUpload
                  className="image"
                  image={image}
                  progress={progress}
                  onChange={selectValueImage}
                  handleDeleteImage={handleDeleteImage}></ImageUpload>
              </form>
            </div>
            <div className="user-desc">
              <div className="user-fullname">
                <span>{userInfo?.fullname || userInfo?.displayName}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="green"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="user-activity">
                <div className="user-box">
                  <h3>Tin đã bình luận</h3>
                  <span>{CommentList?.length}</span>
                </div>
                <div className="user-box">
                  <h3>Tin đã Xem</h3>
                  <span>{PostSeen?.length}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="user-tabs">
            <ul className="nav-tabs">
              <li
                className={`nav-item ${getActiveClass(1, "active")}`}
                onClick={() => toggleTab(1)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <span>Thông tin cá nhân</span>
              </li>
              <li
                className={`nav-item ${getActiveClass(2, "active")}`}
                onClick={() => toggleTab(2)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                <span>Đổi mật khẩu</span>
              </li>
              <li
                className={`nav-item ${getActiveClass(3, "active")}`}
                onClick={() => toggleTab(3)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                  />
                </svg>

                <span>Hoạt động</span>
              </li>
            </ul>
            <div className="tabs-content">
              <div className={`content ${getActiveClass(1, "active")}`}>
                <FormUserInfomation></FormUserInfomation>
              </div>
              <div className={`content ${getActiveClass(2, "active")}`}>
                <FormUserPassword></FormUserPassword>
              </div>
              <div className={`content ${getActiveClass(3, "active")}`}>
                <UserActivity></UserActivity>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </UserInfomationStyles>
  );
};

export default UserInfomation;

const FormUserInfomation = () => {
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
      createdAT: new Date(),
    },
  });
  const WatchGender = watch("gender");
  const { userInfo } = useAuth();
  useEffect(() => {
    async function fakeData() {
      const colRef = doc(db, "users", userInfo.uid);
      await onSnapshot(colRef, (doc) => {
        reset(doc.data());
      });
    }
    fakeData();
  }, [reset, userInfo.uid]);
  const handleUpdateuser = async (values) => {
    try {
      const cloneValues = { ...values };
      console.log(cloneValues);
      cloneValues.status = Number(cloneValues.status);
      cloneValues.role = Number(cloneValues.role);
      const colRef = doc(db, "users", userInfo.uid);
      await updateDoc(colRef, {
        ...cloneValues,
        createdAT: serverTimestamp(),
      });
      toast.success("cap nhat nguoi dung thanh cong!");
    } catch (error) {
      console.log(error);
      toast.error("cap nhat nguoi dung  khong thanh cong!");
    }
  };
  return (
    <form onSubmit={handleSubmit(handleUpdateuser)}>
      <Field>
        <Lable>Fullname</Lable>
        <Input
          name="fullname"
          type="text"
          placeholder="Enter your fullname"
          control={control}></Input>
      </Field>
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
        <Lable>Email</Lable>
        {userInfo?.displayName ? (
          <Input
            disabled
            value={userInfo?.email}
            control={control}
            type="email"></Input>
        ) : (
          <Input
            disabled
            name="email"
            placeholder="Enter your email"
            control={control}
            type="email"></Input>
        )}
      </Field>
      <Field>
        <Lable>Phone</Lable>
        <Input
          name="phone"
          placeholder="Enter your Phone"
          control={control}
          type="text"></Input>
      </Field>
      <Field>
        <Lable>Description</Lable>
        <TextArea name="description" control={control}></TextArea>
      </Field>
      <Button
        style={{ margin: "0 auto", minWidth: "20rem" }}
        isloading={isSubmitting}
        disable={isSubmitting}>
        Update user
      </Button>
    </form>
  );
};
const FormUserPassword = () => {
  const { userInfo } = useAuth();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });
  useEffect(() => {
    async function fakeData() {
      const colRef = doc(db, "users", userInfo.uid);
      await onSnapshot(colRef, (doc) => {
        reset({
          email: doc.data()?.email,
        });
      });
    }
    fakeData();
  }, [reset, userInfo.uid]);
  const handleUpdatepassword = async (values) => {
    if (!isValid) return;
    if (values.password !== userInfo.password) {
      toast.error("Mật khẩu cũ không chính xác!");
      return;
    }
    // updatePassword(auth.currentUser,values.Newpassword).then(function() {
    //   toast.success("Cập nhật mật khẩu thành công!");
    // }).catch(function(error) {
    //   toast.error(error);
    // });; // Get the value of the old passwords
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      values?.password
    );
    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, values?.Newpassword)
      .then(function () {
        const colRef = doc(db, "users", userInfo?.uid);
        updateDoc(colRef, {
          password: values?.Newpassword,
        });
        toast.success("Cập nhật mật khẩu thành công!");
      })
      .catch(function (error) {
        toast.error(error);
      }); // Get the value of the old passwords;
  };
  return (
    <form onSubmit={handleSubmit(handleUpdatepassword)}>
      <Field>
        <Lable>Email</Lable>
        <Input
          disabled
          name="email"
          placeholder="Enter your email"
          control={control}
          type="email"></Input>
      </Field>
      <Field>
        <Lable>Password</Lable>
        <InputPassword
          name="password"
          placeholder="Enter your password"
          control={control}
          type="password"></InputPassword>
      </Field>
      <Field>
        <Lable>New Password</Lable>
        <InputPassword
          name="Newpassword"
          placeholder="Enter your password"
          control={control}
          type="password"></InputPassword>
      </Field>
      <Button
        style={{ margin: "0 auto", minWidth: "20rem" }}
        isloading={isSubmitting}
        disable={isSubmitting}>
        Update user
      </Button>
    </form>
  );
};
