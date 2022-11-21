import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import styled from "styled-components";
import { stringify } from "uuid";
import Button from "../../Components/Button/Button";
import Radio from "../../Components/Checkbox/Radio";
import Field from "../../Components/Field/Field";
import Input from "../../Components/Input/Input";
import Lable from "../../Components/lable/Lable";
import { useAuth } from "../../contexts/Auth-Context";
import { db } from "../../Firebase/Firebase-config";
import { categoryStatus, userRole } from "../../utils/constants";
import DashBoardHeading from "../DashBoard/DashBoardHeading";

const CategoryAddNewStyles = styled.div``;
const CategoryAddNew = () => {
  const { userInfo } = useAuth();
  const {
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      status: categoryStatus.APPROVED,
      createdAT: new Date(),
    },
  });
  const handleAddCategory = async (values) => {
    const CloneVlues = { ...values };
    CloneVlues.slug = slugify(CloneVlues.slug || CloneVlues.name, {
      lower: true,
    });
    userInfo?.role !== userRole.ADMIN
      ? (CloneVlues.status = Number(categoryStatus.UNAPPROVED))
      : (CloneVlues.status = Number(CloneVlues.status));
    try {
      const colref = collection(db, "category");
      await addDoc(colref, {
        ...CloneVlues,
        createdAT: serverTimestamp(),
      });
      toast.success("Them danh muc thanh cong!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      reset({
        name: "",
        slug: "",
        status: categoryStatus.APPROVED,
        createdAT: new Date(),
      });
    }
  };
  const WatchStatus = watch("status");
  return (
    <CategoryAddNewStyles>
      <DashBoardHeading
        title="New Category"
        desc="Add new category"></DashBoardHeading>
      <form onSubmit={handleSubmit(handleAddCategory)}>
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
        {userInfo?.role === userRole.ADMIN ? (
          <div className="form-layout">
            <Field>
              <Lable>Status</Lable>
              <div className="form-radios">
                <Radio
                  name="status"
                  control={control}
                  checked={Number(WatchStatus) === categoryStatus.APPROVED}
                  value={categoryStatus.APPROVED}>
                  Approved
                </Radio>
                <Radio
                  name="status"
                  control={control}
                  checked={Number(WatchStatus) === categoryStatus.UNAPPROVED}
                  value={categoryStatus.UNAPPROVED}>
                  Unapproved
                </Radio>
              </div>
            </Field>
          </div>
        ) : (
          ""
        )}
        <Button
          disabled={isSubmitting}
          isloading={isSubmitting}
          type="submit"
          style={{ margin: "0 auto", minWidth: "20rem" }}>
          Add new Category
        </Button>
      </form>
    </CategoryAddNewStyles>
  );
};

export default CategoryAddNew;
