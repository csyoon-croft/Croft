import React, { useState } from 'react';

import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './NavBar/NavBar';
import SideBar from './SideBar/SideBar';
import { SubNavBarTitle } from './NavBar/SubNavBar/SubNavBarTitle';
import { ContainerArray } from '../component/utils/Data/WholeData';

const Layout = () => {
  const currentPath = useLocation().pathname;
  const [container, setContainer] = useState('옥수수 재배 컨테이너');

  return (
    <div className="flex relative w-screen max-w-full h-screen max-h-full ">
      <SideBar currentPath={currentPath} />
      <div className="flex flex-col w-full h-full ">
        <Navbar title={container} />
        <>
          {SubNavBarTitle(currentPath, setContainer, container, setContainer)}
        </>
        <main className="bg-[#E9EBE180]/[0.5] w-full h-full overflow-auto">
          <Outlet context={{ container, setContainer, ContainerArray }} />
          <div className="flex flex-col absolute bottom-[35px] right-[50px]">
            <img
              className="w-[50px] h-[50px]"
              src="/assets/images/Layout/FloatingTodo.svg"
              alt="todo"
            />
            <img
              className="mt-1 w-[50px] h-[50px]"
              src="/assets/images/Layout/FloatingChatbot.svg"
              alt="chatbot"
            ></img>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;