"use client";
import { useState } from "react";
import SignUpForm from "@/components/SignUpForm";

export default function SignUpPage() {
  const [show, setShow] = useState(true); // always show on signup page

  return <SignUpForm show={show} onClose={() => setShow(false)} />;
}