"use client";
import { useState } from "react";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const [show, setShow] = useState(true);

  return <LoginForm show={show} onClose={() => setShow(false)} />;
}