import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import LandingPage from "./components/LandingPage";
import styles from "@/app/page.module.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import SearchBar from "./components/SearchBar";
import DisplayDoctor from "./components/DisplayDoctor";
import DoctorProfile from "./components/DoctorProfile";
import Review from "./components/Review";
import Patient from "./components/Patient";

export default function Home() {
  return (
    <div className={styles.page_container}>
      {/* <Footer/> */}
      <LandingPage />
      {/* <Login/> */}
      {/* <SignUp/> */}
      {/* <SearchBar/> */}
      {/* <DisplayDoctor /> */}
      {/* <DoctorProfile/> */}
      {/* <Review/>
      <Patient/> */}
    </div>
  );
}
