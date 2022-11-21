import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import styled from "styled-components";
import Button from "../../Components/Button/Button";
import Radio from "../../Components/Checkbox/Radio";
import Dropdown from "../../Components/Dropdown/Dropdown";
import Option from "../../Components/Dropdown/Option";
import Field from "../../Components/Field/Field";
import Input from "../../Components/Input/Input";
import Lable from "../../Components/lable/Lable";
import useUploadImage from "../../Hooks/useUploadImage";
import Toggle from "../../Components/toogle/Toggle";
import { useEffect } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../Firebase/Firebase-config";
import List from "../../Components/Dropdown/List";
import Select from "../../Components/Dropdown/Select";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/Auth-Context";
import DashBoardHeading from "../DashBoard/DashBoardHeading";
import { PostStatus, userRole } from "../../utils/constants";
import ReactQuill, { Quill } from "react-quill";
import axios from "axios";
import ImageUpload from "../../Components/Image/ImageUpload";
import ImageUploader from "quill-image-uploader";
import "react-quill/dist/quill.snow.css";
Quill.register("modules/imageUploader", ImageUploader);
const PostAddNewStyles = styled.div`
  .Post-content {
    margin-bottom: 3rem;
  }
  .content {
    width: 100%;
  }
`;
const PostAddNew = () => {
  const { userInfo } = useAuth();
  const [content, setContent] = useState("");
  const [categories, setcategories] = useState([]);
  const [categoryDetail, setcategoryDetail] = useState([]);
  const [categoriesID, setcategoriesID] = useState("");
  const [selectCategory, setselectCategory] = useState("");
  const [selectCategoryDetail, setselectCategoryDetail] = useState("");
  const [loading, setloading] = useState(false);
  const { control, watch, setValue, handleSubmit, getValues, reset } = useForm({
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
  const watchStatus = watch("status");
  const WatchFeature = watch("feature");
  const { image, handlereset, progress, selectValueImage, handleDeleteImage } =
    useUploadImage(setValue, getValues);
  const AddPostHandle = async (values) => {
    setloading(true);
    try {
      const CloneValues = { ...values };
      CloneValues.slug = slugify(values.slug || values.title, { lower: true });
      userInfo?.role !== userRole.ADMIN
        ? (CloneValues.status = Number(PostStatus.Pending))
        : (CloneValues.status = Number(CloneValues.status));
      const colRef = collection(db, "post");
      await addDoc(colRef, {
        ...CloneValues,
        image,
        content,
        view: 0,
        userId: userInfo.uid,
        createdAT: serverTimestamp(),
      });
      toast.success("Them bai viet thanh cong!");
      reset({
        title: "",
        status: 1,
        slug: "",
        categoryId: "",
        feature: false,
        image: "",
      });
      setContent("");
      setselectCategory("");
      setselectCategoryDetail("");
      handlereset();
    } catch (error) {
      setloading(false);
    } finally {
      setloading(false);
    }
    // handleFileOnchane(CloneValues.image);
  };
  useEffect(() => {
    document.title = "Add new Post ";
  }, []);
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
  const handleOntionCategory = (item) => {
    setValue("categoryId", item.id);
    setselectCategory(item);
    setcategoriesID(item.id);
  };
  const handleOntionCategoryDetail = (item) => {
    setValue("categoryDetailId", item.id);
    setselectCategoryDetail(item);
  };
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
  return (
    <PostAddNewStyles>
      <DashBoardHeading title="New Post" desc="Add new Post"></DashBoardHeading>
      <form onSubmit={handleSubmit(AddPostHandle)}>
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
                disabled={categoriesID === "" ? true : false}
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
          disabled={loading}
          isloading={loading}
          type="submit"
          style={{ margin: "0 auto", minWidth: "20rem" }}>
          Add new post
        </Button>
      </form>
    </PostAddNewStyles>
  );
};

export default PostAddNew;
