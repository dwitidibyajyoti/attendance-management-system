import Sidebar from "./Sidebar";
import React from 'react'
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
          <div className="flex flex-row space-x-3 ml-2 bg-slate-300">
               <Sidebar />
               <Outlet />
        </div>
    )
}

export default Layout
