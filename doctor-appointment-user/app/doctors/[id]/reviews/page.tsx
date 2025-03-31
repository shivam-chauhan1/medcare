"use client";
import Footer from "@/app/components/Footer";
import NotLogin from "@/app/components/NotLogin";
import Review from "@/app/components/Review";
import { useAuth } from "@/app/contextApi/authContext";
import React from "react";

export default function ReviewRoute() {
  const { isLogin } = useAuth();
  return isLogin ? (
    <div>
      <Review />
      <Footer />
    </div>
  ) : (
    <NotLogin />
  );
}
