import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsappFloat";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}