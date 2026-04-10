"use client";
import { useState, useEffect } from "react";
import SignUpForm from "@/components/SignUpForm";
import LoginForm from "@/components/LoginForm";

export default function AuthPage({ initialForm = "signup", onClose }) {
  const [showForm, setShowForm] = useState(initialForm);

  useEffect(() => {
    setShowForm(initialForm);
  }, [initialForm]);

  return (
    <>
      {showForm === "signup" && (
        <SignUpForm
          show={true}
          onClose={onClose}
          switchForm={() => setShowForm("login")}
        />
      )}

      {showForm === "login" && (
        <LoginForm
          show={true}
          onClose={onClose}
          switchForm={() => setShowForm("signup")}
        />
      )}
    </>
  );
}