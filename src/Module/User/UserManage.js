import { async } from "@firebase/util";
import { deleteUser } from "firebase/auth";
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
import { deleteObject, getStorage, ref } from "firebase/storage";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import Swal from "sweetalert2";
import ActionDelete from "../../Components/Action/ActionDelete";
import ActionEdit from "../../Components/Action/ActionEdit";
import FiledAction from "../../Components/Action/FiledAction";
import Button from "../../Components/Button/Button";
import LableStatus from "../../Components/lable/LableStatus";
import Table from "../../Components/table/Table";
import { useAuth } from "../../contexts/Auth-Context";
import { db } from "../../Firebase/Firebase-config";
import useDebounce from "../../Hooks/useDebounce";
import { theme, userRole, userStatus } from "../../utils/constants";
import DashBoardHeading from "../DashBoard/DashBoardHeading";

const UserManageStyles = styled.div`
  .dashboard {
    &-search-wrapper {
      margin-bottom: 1rem;
      display: flex;
      justify-content: flex-end;
    }
    &-search {
      width: 100%;
      max-width: 35rem;
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
  .user {
    &-info {
      display: flex;
      column-gap: 0.5rem;
      align-items: center;
      img {
        width: 5rem;
        height: 5rem;
        object-fit: cover;
        border-radius: 0.3rem;
        flex-shrink: 0;
      }
    }
    &-name {
      flex: 1;
      h3 {
        font-weight: 600;
        font-size: 1.6rem;
      }
      time {
        font-size: 1.4rem;
        color: ${(props) => props.theme.gray80};
      }
    }
  }
`;
const Per_Page = 10;
const UserManage = () => {
  const [userList, setuserList] = useState([]);
  const navigate = useNavigate();
  const [filter, setfilter] = useState("");
  const debouncesearch = useDebounce(filter, 500);
  const [lastdoc, setlasdoc] = useState("");
  const [countPage, setcoutPage] = useState(0);
  const handleLoadmore = async () => {
    // Construct a new query starting at this document,
    // get the next 25 cities.
    const nextRef = query(
      collection(db, "users"),
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
  const { userInfo } = useAuth();
  useEffect(() => {
    async function fakedata() {
      if (userInfo?.role !== userRole.ADMIN) {
        let results = [];
        const docRef = doc(db, "users", userInfo.uid);
        await onSnapshot(docRef, (doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
          setuserList(results);
        });
      } else {
        const colref = collection(db, "users");
        const newRef = debouncesearch
          ? query(
              colref,
              orderBy("fullname"),
              where("fullname", ">=", debouncesearch),
              where("fullname", "<=", debouncesearch + "utf8")
            )
          : query(colref, limit(Per_Page));
        onSnapshot(colref, async (snapshot) => {
          setcoutPage(snapshot.size);
        });
        onSnapshot(newRef, async (snapshot) => {
          let results = [];
          snapshot.docs.forEach((doc) => {
            results.push({
              id: doc.id,
              ...doc.data(),
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
    }
    fakedata();
  }, [debouncesearch, userInfo.role, userInfo.uid]);
  const handleSearchFilter = (e) => {
    setfilter(e.target.value);
  };
  const renderStatus = (status) => {
    switch (status) {
      case userStatus.Active:
        return <LableStatus type="success">Active</LableStatus>;
      case userStatus.PENDING:
        return <LableStatus type="warning">Pending</LableStatus>;
      case userStatus.BAN:
        return <LableStatus type="danger">Ban</LableStatus>;
      default:
        break;
    }
  };
  const renderRole = (role) => {
    switch (role) {
      case userRole.ADMIN:
        return <LableStatus>Admin</LableStatus>;
      case userRole.MOD:
        return <LableStatus>Mod</LableStatus>;
      case userRole.user:
        return <LableStatus>user</LableStatus>;
      default:
        break;
    }
  };
  const handleDeleteUser = async (user) => {
    // await deleteUser(user);
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
        await deleteDoc(doc(db, "users", user.id));
        const storage = getStorage();
        const RegexImage = /%2F(\S+)\?/gm.exec(user?.avatar);
        const image_name = RegexImage?.length > 0 ? RegexImage[1] : "";
        // Create a reference to the file to delete
        const desertRef = ref(storage, "images/" + image_name);
        // Delete the file
        deleteObject(desertRef)
          .then(() => {})
          .catch((error) => {});
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  const handleTocreateUser = () => {
    if (userInfo?.role !== userRole.ADMIN) {
      Swal.fire({
        icon: "warning",
        title: "warning",
        text: "Bạn không có quyền thực hiện hành động này!",
      });
      return;
    }
  };
  return (
    <UserManageStyles>
      <DashBoardHeading title="Users" desc="Manage your Users">
        {userInfo?.role !== userRole.ADMIN ? (
          <Button onClick={handleTocreateUser} height="60px" bg="ghost">
            Create user
          </Button>
        ) : (
          <Button to="/manage/add-user" height="60px" bg="ghost">
            Create user
          </Button>
        )}
      </DashBoardHeading>
      <div className="dashboard-search-wrapper">
        <div className="dashboard-search">
          <input
            type="text"
            className="search-input"
            placeholder="Search user..."
            onChange={handleSearchFilter}
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Info</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 &&
            userList.map((user) => (
              <tr key={user.id}>
                <td title={user.id}>{user.id.slice(0, 3) + "..."}</td>
                <td>
                  <div className="user-info">
                    <img src={user?.avatar || "/avatar.svg"} alt="" />
                    <div className="user-name">
                      <h3>{user?.fullname}</h3>
                      <time>
                        {new Date(user?.createdAT?.toDate()).toLocaleDateString(
                          "vi-VI"
                        )}
                      </time>
                    </div>
                  </div>
                </td>
                {/* <td>{user?.username}</td> */}
                <td title={user.email}>
                  {user.email.replace(/@gmail.com/, "...")}
                </td>
                <td>{renderStatus(user?.status)}</td>
                <td>{renderRole(user?.role)}</td>
                <td>
                  <FiledAction>
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-user?id=${user.id}`)
                      }></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeleteUser(user)}></ActionDelete>
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
    </UserManageStyles>
  );
};

export default UserManage;
