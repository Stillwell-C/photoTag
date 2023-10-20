import React from "react";
import { PhotoTagProvider } from "../Context/PhotoTagContext";
import { Outlet } from "react-router-dom";

const ContextProviderLayout = () => {
  return (
    <PhotoTagProvider>
      <Outlet />
    </PhotoTagProvider>
  );
};

export default ContextProviderLayout;
