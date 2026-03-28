import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import BlogList from "./pages/blog/BlogList";
import CreateBlog from "./pages/blog/CreateBlog";
import Signup from "./pages/auth/Signup";
import ErrorBoundary from "./pages/ErrorBoundary";
import AuthorManagement from "./pages/blog/AuthorManagement";
import Login from "./pages/auth/Login";
import Unauthorized from "./pages/Unauthorized";
// import PrivateRoute from "./pages/PrivateRoute";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import api from "./api/axiosInstance";
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setInitializing = useAuthStore((state) => state.setInitializing);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await api.get("/auth/refresh");
        console.log("app", data);
        setAuth(data.data.accessToken, data.data.user);
      } catch (error) {
        console.log(error);
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, [setAuth, setInitializing]);

  const router = createBrowserRouter([
    {
      path: "/",
      Component: AppLayout,
      ErrorBoundary: ErrorBoundary,
      children: [
        {
          path: "blog",
          element: (
            <PrivateRoute allowedRoles={["READER"]}>
              <BlogList />
            </PrivateRoute>
          ),
        },
        {
          path: "blog/new",
          element: (
            <PrivateRoute allowedRoles={["AUTHOR"]}>
              <CreateBlog />
            </PrivateRoute>
          ),
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
          element: (
            <PrivateRoute allowedRoles={["AUTHOR", "READER"]}>
              <AuthorManagement />
            </PrivateRoute>
          ),
        },
        {
          path: "unauthorized",
          Component: Unauthorized,
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
