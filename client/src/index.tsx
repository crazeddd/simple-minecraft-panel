import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ErrorPage from "./routes/ErrorPage";
import BuildServer from "./routes/BuildServer";
import Panel from "./routes/Panel";
import Support from "./routes/Support";
import AccountSettings from "./routes/AccountSettings";
import Container from "./routes/Container";
import Files from "./routes/Files";

import "./index.css";

const router = createBrowserRouter([
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
    ErrorElement: <ErrorPage />
  },
  {
    path: "/containers/:id/files",
    element: <Files />,
    ErrorElement: <ErrorPage />
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <RouterProvider router={router} />
);
