import { async } from "@firebase/util";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import Swal from "sweetalert2";
import ActionDelete from "../../Components/Action/ActionDelete";
import ActionEdit from "../../Components/Action/ActionEdit";
import ActionView from "../../Components/Action/ActionView";
import FiledAction from "../../Components/Action/FiledAction";
import Button from "../../Components/Button/Button";
import Dropdown from "../../Components/Dropdown/Dropdown";
import List from "../../Components/Dropdown/List";
import Option from "../../Components/Dropdown/Option";
import Select from "../../Components/Dropdown/Select";
import LableStatus from "../../Components/lable/LableStatus";
import Pagination from "../../Components/Pagination/Pagination";
import Table from "../../Components/table/Table";
import { useAuth } from "../../contexts/Auth-Context";
import { db } from "../../Firebase/Firebase-config";
import useCategory from "../../Hooks/useCategory";
import useDebounce from "../../Hooks/useDebounce";
import useUser from "../../Hooks/useUser";
import { PostStatus, userRole } from "../../utils/constants";
import DashBoardHeading from "../DashBoard/DashBoardHeading";

const PostManageStyles = styled.div`
  .dashboard {
    &-search-wrapper {
      margin-bottom: 1rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    &-search {
      width: 100%;
      max-width: 35rem;
      input {
        height: 100%;
      }
    }
    &-select {
      width: 100%;
      max-width: 30rem;
    }
  }
  .search {
    &-input {
      width: 100%;
      border: 1px solid #eee;
      padding: 1.5rem;
      border-radius: 0.8rem;
    }
  }
  .table {
    &-post {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    &-post-img {
      width: 6.6rem;
      height: 5.5rem;
      object-fit: cover;
      border-radius: 0.8rem;
    }
    &-category {
      color: ${(props) => props.theme.gray80};
    }
    &-author {
      color: ${(props) => props.theme.gray80};
    }
    &-post-info {
      flex-grow: 1;
      h3 {
        font-weight: 600;
        font-size: 1.6rem;
        max-width: 35rem;
        white-space: pre-wrap;
      }
      time {
        font-size: 1.4rem;
        color: ${(props) => props.theme.gray80};
      }
    }
  }
  .post-pagination {
    margin-top: 4rem;
  }
`;
const Per_Page = 10;
const PostManage = () => {
  const [userList, setuserList] = useState([]);
  const [CategoryList, setCategoryList] = useState([]);
  const [filter, setfilter] = useState("");
  const debouncesearch = useDebounce(filter, 500);
  const [lastdoc, setlasdoc] = useState("");
  const [countPage, setcoutPage] = useState(0);
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [select, setselect] = useState("");
  const handleLoadmore = async () => {
    // Construct a new query starting at this document,
    // get the next 25 cities.
    const nextRef = query(
      collection(db, "post"),
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
      setuserList([...userList, ...results]);
    });
  };
  useEffect(() => {
    async function getdata() {
      const colRef = collection(db, "post");
      const newRef = debouncesearch
        ? query(
            colRef,
            orderBy("title"),
            where("title", ">=", debouncesearch),
            where("title", "<=", debouncesearch + "utf8")
          )
        : select
        ? select === "Top bài viết xem nhiều nhất"
          ? query(colRef, limit(Per_Page), orderBy("view", "desc"))
          : query(colRef, limit(Per_Page), orderBy("view", "asc"))
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
        setuserList(results);
      });
    }
    getdata();
  }, [debouncesearch, select]);
  useEffect(() => {
    const colRef = collection(db, "category");
    onSnapshot(colRef, async (snapshot) => {
      let results = [];
      snapshot.docs.forEach((item) => {
        results.push({
          id: item.id,
          ...item.data(),
        });
      });
      setCategoryList(results);
    });
  }, []);
  const handleDeletePost = async (item) => {
    if (userInfo?.role !== userRole.ADMIN) {
      Swal.fire({
        icon: "warning",
        title: "warning",
        text: "Bạn không có quyền thực hiện hành động này!",
      });
      return;
    }
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
        await deleteDoc(doc(db, "post", item.id));
        const storage = getStorage();
        const RegexImage = /%2F(\S+)\?/gm.exec(item?.image);
        const image_name = RegexImage?.length > 0 ? RegexImage[1] : "";
        // Create a reference to the file to delete
        const desertRef = ref(storage, "images/" + image_name);
        // Delete the file
        deleteObject(desertRef)
          .then(() => {
            toast.success("Xoa image thanh cong");
          })
          .catch((error) => {
            toast.success("Xoa image khong thanh cong");
          });
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  const handleSearchFilter = (e) => {
    setfilter(e.target.value);
  };

  return (
    <PostManageStyles>
      <DashBoardHeading
        title="Posts"
        desc="Manage your Posts"></DashBoardHeading>
      <div className="dashboard-search-wrapper">
        <div className="dashboard-select">
          <Dropdown>
            <Select
              placehodler={`${select || "Sắp xếp bài viết"}`}></Select>
            <List>
              <Option onClick={() => setselect("Top bài viết xem nhiều nhất")}>
                Top bài viết xem nhiều nhất
              </Option>
              <Option onClick={() => setselect("Top bài viết xem ít nhất")}>
                Top bài viết xem ít nhất
              </Option>
            </List>
          </Dropdown>
        </div>
        <div className="dashboard-search">
          <input
            type="text"
            className="search-input"
            placeholder="Search post..."
            onChange={handleSearchFilter}
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>View</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 &&
            userList.map((item) => (
              <tr key={item?.id}>
                <td title={item?.id}>{item?.id?.slice(0, 3) + "..."}</td>
                <td>
                  <div className="table-post">
                    <img src={item?.image} alt="" className="table-post-img" />
                    <div className="table-post-info">
                      <h3>{item?.title}</h3>
                      <time className="table-post-time">
                        {new Date(item?.createdAT?.toDate()).toLocaleDateString(
                          "vi-VI"
                        )}
                      </time>
                    </div>
                  </div>
                </td>
                <td>
                  <TableCategory categoryId={item?.categoryId}></TableCategory>
                </td>
                <td>
                  <TableUser userId={item?.userId}></TableUser>
                </td>
                <td>{item?.view || 0}</td>
                <td>
                  {Number(item.status) === PostStatus.APPROVED && (
                    <LableStatus type="success">Approved</LableStatus>
                  )}
                  {Number(item.status) === PostStatus.Pending && (
                    <LableStatus type="warning">Pending</LableStatus>
                  )}
                  {Number(item.status) === PostStatus.REJECT && (
                    <LableStatus type="danger">Reject</LableStatus>
                  )}
                </td>
                <td>
                  <FiledAction>
                    <ActionView
                      onClick={() => navigate(`/${item.slug}`)}></ActionView>
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-post?id=${item.id}`)
                      }></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeletePost(item)}></ActionDelete>
                  </FiledAction>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {countPage > userList.length && (
        <Button
          onClick={handleLoadmore}
          height="5rem"
          style={{ margin: "0 auto" }}>
          Loadmore
        </Button>
      )}
    </PostManageStyles>
  );
};
export default PostManage;

const TableCategory = ({ categoryId = "" }) => {
  const { category } = useCategory(categoryId);
  if (!categoryId || !category?.name) return null;
  return <span className="table-category">{category.name}</span>;
};
const TableUser = ({ userId = "" }) => {
  const { user } = useUser(userId);
  if (!userId) return null;
  return <span className="table-author">{user?.fullname}</span>;
};
