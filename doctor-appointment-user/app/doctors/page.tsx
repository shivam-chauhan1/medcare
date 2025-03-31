"use client";
import React from "react";
import DisplayDoctor from "../components/DisplayDoctor";
import { useAuth } from "../contextApi/authContext";
import NotLogin from "../components/NotLogin";
export default function DoctorRoute() {
  const { isLogin } = useAuth();
  return isLogin ? <DisplayDoctor /> : <NotLogin />;
}
