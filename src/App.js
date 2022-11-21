import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/Auth-Context";
import { ColorProvider } from "./contexts/Color-Context";
import CategoryDetail from "./Module/Category/CategoryDetail";
import CategoryDetailAddNew from "./Module/Category/CategoryDetailAddNew";
import CategoryDetailUpdate from "./Module/Category/CategoryDetailUpdate";
import UserInfomation from "./Module/User/UserInfomation";
import CategoryDetailPage from "./Pages/CategoryDetailPage";
import CategoryPage from "./Pages/CategoryPage";
import SeachPage from "./Pages/SeachPage";

const CategoryAddNew = React.lazy(() =>
  import("./Module/Category/CategoryAddNew")
);
const CategoryManage = React.lazy(() =>
  import("./Module/Category/CategoryManage")
);
const CategoryUpdate = React.lazy(() =>
  import("./Module/Category/CategoryUpdate")
);
const DashBoardLayout = React.lazy(() =>
  import("./Module/DashBoard/DashBoardLayout")
);
const PostAddNew = React.lazy(() => import("./Module/Posts/PostAddNew"));
const PostManage = React.lazy(() => import("./Module/Posts/PostManage"));
const PostUpdate = React.lazy(() => import("./Module/Posts/PostUpdate"));
const UserAddnew = React.lazy(() => import("./Module/User/UserAddnew"));
const UserManage = React.lazy(() => import("./Module/User/UserManage"));
const UserProfile = React.lazy(() => import("./Module/User/UserProfile"));
const UserUpdate = React.lazy(() => import("./Module/User/UserUpdate"));
const DashBoardPage = React.lazy(() => import("./Pages/DashBoardPage"));
const HomePage = React.lazy(() => import("./Pages/HomePage"));
const NotFoundPage = React.lazy(() => import("./Pages/NotFoundPage"));
const PostDetailPage = React.lazy(() => import("./Pages/PostDetailPage"));
const SignInPage = React.lazy(() => import("./Pages/SignInPage"));
const SignUpPage = React.lazy(() => import("./Pages/SignUpPage"));

function App() {
  return (
    <>
      <ColorProvider>
        <AuthProvider>
          <Suspense>
            <Routes>
              <Route path="/" element={<HomePage></HomePage>}></Route>
              <Route
                path="/sign-up"
                element={<SignUpPage></SignUpPage>}></Route>
              <Route
                path="/sign-in"
                element={<SignInPage></SignInPage>}></Route>
              <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
              <Route path="/Tim-kiem" element={<SeachPage></SeachPage>}></Route>
              <Route
                path="/category/:slug"
                element={<CategoryPage></CategoryPage>}></Route>
                <Route
                path="/:slug/:slug"
                element={<CategoryDetailPage></CategoryDetailPage>}></Route>
              <Route
                path="/:slug"
                element={<PostDetailPage></PostDetailPage>}></Route>
                <Route
                path="/user/:id"
                element={<UserInfomation></UserInfomation>}></Route>
              <Route element={<DashBoardLayout></DashBoardLayout>}>
                <Route
                  path="/dashboard"
                  element={<DashBoardPage></DashBoardPage>}></Route>
                <Route
                  path="/manage/post"
                  element={<PostManage></PostManage>}></Route>
                <Route
                  path="/manage/add-post"
                  element={<PostAddNew></PostAddNew>}></Route>
                <Route
                  path="/manage/update-post"
                  element={<PostUpdate></PostUpdate>}></Route>
                <Route
                  path="/manage/category"
                  element={<CategoryManage></CategoryManage>}></Route>
                <Route
                  path="/manage/add-category-Detail"
                  element={
                    <CategoryDetailAddNew></CategoryDetailAddNew>
                  }></Route>
                <Route
                  path="/manage/categoryDetail"
                  element={<CategoryDetail></CategoryDetail>}></Route>
                   <Route
                  path="/manage/update-categoryDetail"
                  element={<CategoryDetailUpdate></CategoryDetailUpdate>}></Route>
                <Route
                  path="/manage/add-category"
                  element={<CategoryAddNew></CategoryAddNew>}></Route>
                <Route
                  path="/manage/update-category"
                  element={<CategoryUpdate></CategoryUpdate>}></Route>
                <Route
                  path="/manage/user"
                  element={<UserManage></UserManage>}></Route>
                <Route
                  path="/manage/add-user"
                  element={<UserAddnew></UserAddnew>}></Route>
                <Route
                  path="/manage/update-user"
                  element={<UserUpdate></UserUpdate>}></Route>
                <Route
                  path="/manage/profile"
                  element={<UserProfile></UserProfile>}></Route>
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </ColorProvider>
    </>
  );
}

export default App;
