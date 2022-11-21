import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import ActionDelete from "../../Components/Action/ActionDelete";
import ActionEdit from "../../Components/Action/ActionEdit";
import ActionView from "../../Components/Action/ActionView";
import FiledAction from "../../Components/Action/FiledAction";
import Button from "../../Components/Button/Button";
import LableStatus from "../../Components/lable/LableStatus";
import Table from "../../Components/table/Table";
import { useAuth } from "../../contexts/Auth-Context";
import { db } from "../../Firebase/Firebase-config";
import useDebounce from "../../Hooks/useDebounce";
import { categoryStatus, userRole } from "../../utils/constants";
import DashBoardHeading from "../DashBoard/DashBoardHeading";
import PostCategory from "../Posts/PostCategory";

const CategoryDetailStyles = styled.div`
  .table-slug {
    color: ${(props) => props.theme.gray80};
    font-style: italic;
  }
  .tools {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 1rem;
  }
  .search {
    padding: 1.2rem 1.4rem;
    border-radius: 0.5rem;
    outline: none;
    border: 1px solid #eee;
  }
`;
const Per_Page = 10;
const CategoryDetail = () => {
  const navigate = useNavigate();
  const [categoryList, setcategoryList] = useState([]);
  const [filter, setfilter] = useState("");
  const debouncesearch = useDebounce(filter, 500);
  const [lastdoc, setlasdoc] = useState("");
  const [countPage, setcoutPage] = useState(0);
  const { userInfo } = useAuth();
  const handleLoadmore = async () => {
    // Construct a new query starting at this document,
    // get the next 25 cities.
    const nextRef = query(
      collection(db, "categoryDetail"),
      orderBy("createdAT", "desc"),
      startAfter(lastdoc),
      limit(Per_Page)
    );
    onSnapshot(nextRef, async (snapshot) => {
      let results = [];
      snapshot.docs.forEach((item) => {
        results.push({
          id: item.id,
          ...item.data(),
        });
      });
      const documentSnapshots = await getDocs(nextRef);
      // Get the last visible document
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setlasdoc(lastVisible);
      setcategoryList([...categoryList, ...results]);
    });
  };
  useEffect(() => {
    async function getdata() {
      const colRef = collection(db, "categoryDetail");
      const newRef = debouncesearch
        ? query(
            colRef,
            orderBy("name"),
            where("name", ">=", debouncesearch),
            where("name", "<=", debouncesearch + "utf8")
          )
        : query(colRef, limit(Per_Page), orderBy("createdAT", "desc"));
      onSnapshot(colRef, async (snapshot) => {
        setcoutPage(snapshot.size);
      });
      onSnapshot(newRef, async (snapshot) => {
        let results = [];
        snapshot.docs.forEach((item) => {
          results.push({
            id: item.id,
            ...item.data(),
          });
        });
        const documentSnapshots = await getDocs(newRef);
        // Get the last visible document
        const lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setlasdoc(lastVisible);
        setcategoryList(results);
      });
    }
    getdata();
  }, [debouncesearch]);
  const handleDelelteCategory = async (id) => {
    if (userInfo?.role !== userRole.ADMIN) {
      Swal.fire({
        icon: "warning",
        title: "warning",
        text: "Bạn không có quyền thực hiện hành động này!",
      });
      return;
    }
    const colRef = doc(db, "categoryDetail", id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  const handleSearchFilter = (e) => {
    setfilter(e.target.value);
  };
  return (
    <CategoryDetailStyles>
      <DashBoardHeading title="Categories" desc="Manage your category Detail">
        <Button to="/manage/add-category-Detail" height="60px" bg="ghost">
          Create category Detail
        </Button>
      </DashBoardHeading>
      <div className="tools">
        <input
          type="text"
          className="search"
          placeholder="Search category...."
          onChange={handleSearchFilter}
        />
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categoryList.length > 0 &&
            categoryList.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  <span className="table-slug">
                    <PostCategory categoryId={item.categoryId}></PostCategory>
                  </span>
                </td>
                <td>
                  {Number(item.status) === categoryStatus.APPROVED && (
                    <LableStatus type="success">Approved</LableStatus>
                  )}
                  {Number(item.status) === categoryStatus.UNAPPROVED && (
                    <LableStatus type="warning">Unaproved</LableStatus>
                  )}
                </td>
                <td>
                  <FiledAction>
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-categoryDetail?id=${item.id}`)
                      }></ActionEdit>
                    <ActionDelete
                      onClick={() =>
                        handleDelelteCategory(item.id)
                      }></ActionDelete>
                  </FiledAction>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {countPage > categoryList.length && (
        <Button
          onClick={handleLoadmore}
          height="5rem"
          style={{ margin: "0 auto" }}>
          Loadmore
        </Button>
      )}
    </CategoryDetailStyles>
  );
};

export default CategoryDetail;
