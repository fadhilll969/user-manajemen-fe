import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sidebar open={open} setOpen={setOpen} />

      <div
        style={{
          marginLeft: "200px",
          padding: "20px",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
    </>
  );
};

export default Layout;