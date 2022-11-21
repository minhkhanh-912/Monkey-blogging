import { async } from "@firebase/util";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import Button from "../../Components/Button/Button";
import Radio from "../../Components/Checkbox/Radio";
import Field from "../../Components/Field/Field";
import Input from "../../Components/Input/Input";
import Lable from "../../Components/lable/Lable";
import { useAuth } from "../../contexts/Auth-Context";
import { db } from "../../Firebase/Firebase-config";
import { userRole } from "../../utils/constants";
import DashBoardHeading from "../DashBoard/DashBoardHeading";

const CategoryUpdate = () => {
  const { userInfo } = useAuth();
  const {
    control,
    watch,
    reset,
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
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const categoryId = params.get("id");
  useEffect(() => {
    async function fakeData() {
      const colRef = doc(db, "category", categoryId);
      await onSnapshot(colRef, (doc) => {
        reset(doc.data());
      });
    }
    fakeData();
  }, [categoryId, reset]);
  const WatchStatus = watch("status");
  const HandleUpdateCategory = (values) => {
    const colRef = doc(db, "category", categoryId);
    updateDoc(colRef, {
      name: values.name,
      slug: slugify(values.slug || values.name, { lower: true }),
      status: Number(values.status),
    });
    toast.success("update category thanh cong!");
    navigate("/manage/category");
  };
  if (!categoryId) return;
  return (
    <div>
      <DashBoardHeading
        title="update category"
        desc={`update your category id: ${categoryId}`}></DashBoardHeading>
      <form onSubmit={handleSubmit(HandleUpdateCategory)}>
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
        {userInfo?.role === userRole.ADMIN ?
        <div className="form-layout">
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
        </div>:""
        }
        <Button disabled={isSubmitting} isloading={isSubmitting} type="submit" style={{ margin: "0 auto", minWidth: "20rem" }} disab>
          Update Category
        </Button>
      </form>
    </div>
  );
};

export default CategoryUpdate;
