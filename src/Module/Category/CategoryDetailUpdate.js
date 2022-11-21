import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import styled from "styled-components";
import Button from "../../Components/Button/Button";
import Radio from "../../Components/Checkbox/Radio";
import Dropdown from "../../Components/Dropdown/Dropdown";
import List from "../../Components/Dropdown/List";
import Option from "../../Components/Dropdown/Option";
import Select from "../../Components/Dropdown/Select";
import Field from "../../Components/Field/Field";
import Input from "../../Components/Input/Input";
import Lable from "../../Components/lable/Lable";
import { useAuth } from "../../contexts/Auth-Context";
import { db } from "../../Firebase/Firebase-config";
import { categoryStatus, userRole } from "../../utils/constants";
import DashBoardHeading from "../DashBoard/DashBoardHeading";

const CategoryDetailUpdateStyles = styled.div``;
const CategoryDetailUpdate = () => {
  const { userInfo } = useAuth();
  const {
    control,
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      status: 1,
      createdAT: new Date(),
    },
  });
  const [categories, setcategories] = useState([]);
  const [selectCategory, setselectCategory] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const categoryDetailId = params.get("id");
  const handleOntionCategory = (item) => {
    setValue("categoryId", item.id);
    setselectCategory(item);
  };
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
    async function fakeData() {
      const colRef = doc(db, "categoryDetail", categoryDetailId);
      const docsnapShot = await getDoc(colRef);
      if (docsnapShot.data()) {
        reset(docsnapShot.data());
        categories.map((category) =>
          String(category.id) === String(docsnapShot.data().categoryId)
            ? setselectCategory(category)
            : ""
        );
      }
    }
    fakeData();
  }, [categories, categoryDetailId, reset]);
  const WatchStatus = watch("status");
  const HandleUpdateCategoryDetail = (values) => {
    const colRef = doc(db, "categoryDetail", categoryDetailId);
    userInfo?.role !== userRole.ADMIN
      ? (values.status = Number(categoryStatus.UNAPPROVED))
      : (values.status = Number(values.status));
    updateDoc(colRef, {
      name: values.name,
      slug: slugify(values.slug || values.name, { lower: true }),
      status: Number(values.status),
      ...values,
    });
    toast.success("update category thanh cong!");
    navigate("/manage/categoryDetail");
  };
  if (!categoryDetailId) return;
  return (
    <CategoryDetailUpdateStyles>
      <DashBoardHeading
        title="update category"
        desc={`update your category Detail id: ${categoryDetailId}`}></DashBoardHeading>
      <form onSubmit={handleSubmit(HandleUpdateCategoryDetail)}>
        <div className="form-layout">
          <Field>
            <Lable htmlFor="name">name</Lable>
            <Input
              control={control}
              name="name"
              type="text"
              required
              placeholder="Enter your category name"></Input>
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
          {userInfo?.role === userRole.ADMIN ? (
            <Field>
              <Lable>Status</Lable>
              <div className="form-radios">
                <Radio
                  name="status"
                  control={control}
                  checked={Number(WatchStatus) === 1}
                  value={1}>
                  Approved
                </Radio>
                <Radio
                  name="status"
                  control={control}
                  checked={Number(WatchStatus) === 2}
                  value={2}>
                  Unapproved
                </Radio>
              </div>
            </Field>
          ) : (
            ""
          )}
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
        </div>
        <Button
          disabled={isSubmitting}
          isloading={isSubmitting}
          type="submit"
          style={{ margin: "0 auto", minWidth: "20rem" }}
          disab>
          Update CategoryDetail
        </Button>
      </form>
    </CategoryDetailUpdateStyles>
  );
};

export default CategoryDetailUpdate;
