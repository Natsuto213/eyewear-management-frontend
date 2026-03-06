import React from "react";
import ReactDOM from "react-dom/client";
import PageRoute from "@/PageRoute.jsx";
import { BrowserRouter } from "react-router-dom";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PageRoute />
    </BrowserRouter>
  </React.StrictMode>
);