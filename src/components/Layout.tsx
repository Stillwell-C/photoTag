import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar";

const Layout = () => {
  return (
    <div className='flex flex-col'>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
