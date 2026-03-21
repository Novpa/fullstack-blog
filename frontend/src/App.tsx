import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import BlogList from "./pages/blog/BlogList";
import CreateBlog from "./pages/blog/CreateBlog";
import Signup from "./pages/auth/Signup";
import ErrorBoundary from "./pages/ErrorBoundary";
import AuthorManagement from "./pages/blog/AuthorManagement";
import Login from "./pages/auth/Login";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: AppLayout,
      ErrorBoundary: ErrorBoundary,
      children: [
        {
          path: "blog",
          Component: BlogList,
        },
        {
          path: "blog/new",
          Component: CreateBlog,
        },
        {
          path: "login",
          Component: Login,
        },
        {
          path: "signup",
          Component: Signup,
        },
        {
          path: "author/management",
          Component: AuthorManagement,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
