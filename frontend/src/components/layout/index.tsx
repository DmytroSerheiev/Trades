import React from "react";
import HeadMetaData from "../headMetadata";
import Navbar from "../navbar";
interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string | undefined;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  return (
    <>
      <HeadMetaData pageTitle={pageTitle} />
      <Navbar />
      {children}
    </>
  );
};

export default Layout;
