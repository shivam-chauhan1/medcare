"use client";
import LandingPage from "@/app/components/LandingPage";
import NotLogin from "@/app/components/NotLogin";
import { useAuth } from "@/app/contextApi/authContext";
import React from "react";

export default function AppointmentRoute() {
  const { isLogin } = useAuth();
  return isLogin ? <LandingPage /> : <NotLogin />;
}
