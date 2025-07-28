// src/Components/Layout/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* This is where route content will render */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
