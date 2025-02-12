import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";

import ErrorPage from "./routes/ErrorPage";
import BuildServer from "./routes/CreateServer";
import Panel from "./routes/Panel";
import Support from "./routes/Support";
import AccountSettings from "./routes/AccountSettings";
import Container from "./routes/Container";
import Files from "./routes/FileManager";
import Login from "./routes/Login";
import SignUp from "./routes/SignUp";

import "./index.css";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("token") ? true : false;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <SignUp />,
    errorElement: <ErrorPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Panel />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/create-server",
        element: <BuildServer />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/support",
        element: <Support />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/account",
        element: <AccountSettings />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/containers/:id",
        element: <Container />,
        ErrorElement: <ErrorPage />,
      },
      {
        path: "/containers/:id/files",
        element: <Files />,
        ErrorElement: <ErrorPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<RouterProvider router={router} />);
