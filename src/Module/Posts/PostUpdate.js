import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../Components/Button/Button";
import Radio from "../../Components/Checkbox/Radio";
import Dropdown from "../../Components/Dropdown/Dropdown";
import List from "../../Components/Dropdown/List";
import Option from "../../Components/Dropdown/Option";
import Select from "../../Components/Dropdown/Select";
import Field from "../../Components/Field/Field";
import ImageUpload from "../../Components/Image/ImageUpload";
import Input from "../../Components/Input/Input";
import Lable from "../../Components/lable/Lable";
import Toggle from "../../Components/toogle/Toggle";
import { db } from "../../Firebase/Firebase-config";
import useUploadImage from "../../Hooks/useUploadImage";
import DashBoardHeading from "../DashBoard/DashBoardHeading";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import ReactQuill, { Quill } from "react-quill";
import ImageUploader from "quill-image-uploader";
import { useMemo } from "react";
import axios from "axios";
import { PostStatus, userRole } from "../../utils/constants";
import { useAuth } from "../../contexts/Auth-Context";

Quill.register("modules/imageUploader", ImageUploader);

const PostUpdateStyles = styled.div`
  .Post-content {
    margin-bottom: 3rem;
  }
  .content {
    width: 100%;
  }
`;
const PostUpdate = () => {
  const { userInfo } = useAuth();
  const [param] = useSearchParams();
  const navigate = useNavigate();
  const [categories, setcategories] = useState([]);
  const [categoryDetail, setcategoryDetail] = useState([]);
  const [selectCategory, setselectCategory] = useState("");
  const [selectCategoryDetail, setselectCategoryDetail] = useState("");
  const [categoriesID, setcategoriesID] = useState("");
  const PostID = param.get("id");
  const [content, setContent] = useState("");
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    getValues,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      status: 1,
      slug: "",
      categoryId: "",
      feature: false,
      image: "",
    },
  });
  const imageUrl = getValues("image");
  const image_name = getValues("image_name");
  const { image, setimage, progress, selectValueImage, handleDeleteImage } =
    useUploadImage(setValue, getValues, image_name, deleteimage);

  async function deleteimage() {
    const colRef = doc(db, "post", PostID);
    await updateDoc(colRef, {
      avatar: "",
    });
  }
  useEffect(() => {
    setimage(imageUrl);
  }, [imageUrl, setimage]);
  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "category");
      const q = query(colRef, where("status", "==", 1));
      let results = [];
      onSnapshot(q, (Snapshot) => {
        Snapshot.docs.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setcategories(results);
      });
    }
    getData();
  }, []);
  const handleOntionCategory = (item) => {
    setValue("categoryId", item.id);
    setselectCategory(item);
    setcategoriesID(item.id);
  };
  const handleOntionCategoryDetail = (item) => {
    setValue("categoryDetailId", item.id);
    setselectCategoryDetail(item);
  };
  const watchStatus = watch("status");
  const WatchFeature = watch("feature");
  const UpdatePostHandle = async (values) => {
    if (!isValid) return;
    const colRef = doc(db, "post", PostID);
    userInfo?.role !== userRole.ADMIN
        ? (values.status = Number(PostStatus.Pending))
        : (values.status = Number(values.status));
    await updateDoc(colRef, {
      ...values,
      image,
      createdAT: serverTimestamp(),
      content,
    });
    toast.success("update post thanh cong!");
    navigate("/manage/post");
  };
  const[categoryDetailAll,setcategoryDetailAll] = useState([]);
  useEffect(() => {
    async function getData() {
      if (!PostID) return;
      const colRef = doc(db, "post", PostID);
      const docsnapShot = await getDoc(colRef);
      if (docsnapShot.data()) {
        reset(docsnapShot.data());
        setContent(docsnapShot.data()?.content);
        setcategoriesID(docsnapShot.data()?.categoryId);
        categories.map((category) =>
          String(category.id) === String(docsnapShot.data().categoryId)
            ? setselectCategory(category)
            : ""
        );
        categoryDetailAll.map((category) =>
          String(category.id) === String(docsnapShot.data().categoryDetailId)
            ? setselectCategoryDetail(category)
            : ""
        );
      }
    }
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PostID, categories]);

  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "categoryDetail");
      const q = query(
        colRef,
        where("status", "==", 1),
      );
      let results = [];
      onSnapshot(q, (Snapshot) => {
        Snapshot.docs.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setcategoryDetailAll(results);
      });
    }
    getData();
  }, [categoryDetailAll]);
  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "categoryDetail");
      const q = query(
        colRef,
        where("status", "==", 1),
        where("categoryId", "==", categoriesID)
      );
      let results = [];
      onSnapshot(q, (Snapshot) => {
        Snapshot.docs.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setcategoryDetail(results);
      });
    }
    getData();
  }, [categoriesID]);
  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"],
      ],
      imageUploader: {
        // https://api.imgbb.com/1/upload?key=20be738ac4c04966d806ac1adc72f328
        upload: async (file) => {
          const bodyFormData = new FormData();
          bodyFormData.append("image", file);
          const response = await axios({
            method: "POST",
            url: "https://api.imgbb.com/1/upload?key=20be738ac4c04966d806ac1adc72f328",
            data: bodyFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          return response.data.data.url;
        },
      },
    }),
    []
  );
  if (!PostID) return;
  return (
    <PostUpdateStyles>
      <DashBoardHeading
        title="Update Post"
        desc="Update Post content"></DashBoardHeading>
      <form onSubmit={handleSubmit(UpdatePostHandle)}>
        <div className="form-layout">
          <Field>
            <Lable htmlFor="title">Title</Lable>
            <Input
              control={control}
              name="title"
              type="text"
              required
              placeholder="Enter your title"></Input>
          </Field>
          <Field>
            <Lable htmlFor="slug">slug</Lable>
            <Input
              control={control}
              name="slug"
              type="text"
              placeholder="Enter your slug"></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Lable htmlFor="Category">Category</Lable>
            <Dropdown>
              <Select
                placehodler={`${
                  selectCategory?.name || "Select your Category"
                }`}></Select>
              <List>
                {categories.length > 0 &&
                  categories.map((item) => (
                    <Option
                      key={item.id}
                      onClick={() => handleOntionCategory(item)}>
                      {item.name}
                    </Option>
                  ))}
              </List>
            </Dropdown>
          </Field>
          <Field>
            <Lable htmlFor="Category">Category Detail</Lable>
            <Dropdown>
              <Select
                placehodler={`${
                  selectCategoryDetail?.name || "Select your Category Detail"
                }`}></Select>
              <List>
                {categoryDetail.length > 0 &&
                  categoryDetail.map((item) => (
                    <Option
                      key={item.id}
                      onClick={() => handleOntionCategoryDetail(item)}>
                      {item.name}
                    </Option>
                  ))}
              </List>
            </Dropdown>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Lable htmlFor="Category">Image</Lable>
            {/* <input type="file" name="image" onChange={selectValueImage} /> */}
            <ImageUpload
              image={image}
              progress={progress}
              onChange={selectValueImage}
              handleDeleteImage={handleDeleteImage}></ImageUpload>
          </Field>
        </div>
        <div className="Post-content">
          <Field>
            <Lable>Content</Lable>
            <div className="content entry-content">
              <ReactQuill
                theme="snow"
                modules={modules}
                value={content}
                onChange={setContent}
              />
            </div>
          </Field>
        </div>
        <div className="form-layout">
          {userInfo?.role === userRole.ADMIN ? (
            <Field>
              <Lable htmlFor="Approved">Status</Lable>
              <div className="form-radios">
                <Radio
                  control={control}
                  name="status"
                  value={1}
                  checked={Number(watchStatus) === 1}>
                  Approved
                </Radio>
                <Radio
                  control={control}
                  name="status"
                  value={2}
                  checked={Number(watchStatus) === 2}>
                  pending
                </Radio>
                <Radio
                  control={control}
                  name="status"
                  value={3}
                  checked={Number(watchStatus) === 3}>
                  reject
                </Radio>
              </div>
            </Field>
          ) : (
            ""
          )}
          <Field>
            <Lable htmlFor="Category">Feature Post</Lable>
            <Toggle
              on={WatchFeature === true}
              onClick={() => setValue("feature", !WatchFeature)}></Toggle>
          </Field>
        </div>
        <Button
          type="submit"
          isloading={isSubmitting}
          disabled={isSubmitting}
          style={{ margin: "0 auto", minWidth: "20rem" }}>
          Update post
        </Button>
      </form>
    </PostUpdateStyles>
  );
};

export default PostUpdate;
