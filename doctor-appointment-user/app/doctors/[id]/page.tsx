"use client";
import DoctorProfile from "@/app/components/DoctorProfile";
import Footer from "@/app/components/Footer";
import NotLogin from "@/app/components/NotLogin";
import { useAuth } from "@/app/contextApi/authContext";
import React from "react";

export default function DoctorIdRoute() {
  const { isLogin } = useAuth();
  return isLogin ? (
    <>
      <DoctorProfile />
      <Footer />
    </>
  ) : (
    <NotLogin />
  );
}
