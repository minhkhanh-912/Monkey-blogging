import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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

const CategoryDetailAddNewStyles = styled.div``;
const CategoryDetailAddNew = () => {
  const { userInfo } = useAuth();
  const [categories, setcategories] = useState([]);
  const [selectCategory, setselectCategory] = useState("");
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
  };
  const handleAddCategory = async (values) => {
    const CloneVlues = { ...values };
    CloneVlues.slug = slugify(CloneVlues.slug || CloneVlues.name, {
      lower: true,
    });
    userInfo?.role !== userRole.ADMIN
      ? (CloneVlues.status = Number(categoryStatus.UNAPPROVED))
      : (CloneVlues.status = Number(CloneVlues.status));
    try {
      const colref = collection(db, "categoryDetail");
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
      setselectCategory("");
    }
  };
  const WatchStatus = watch("status");
  return (
    <CategoryDetailAddNewStyles>
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
        <div className="form-layout">
          {userInfo?.role === userRole.ADMIN ? (
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
          style={{ margin: "0 auto", minWidth: "20rem" }}>
          Add new categoryDetail
        </Button>
      </form>
    </CategoryDetailAddNewStyles>
  );
};

export default CategoryDetailAddNew;
