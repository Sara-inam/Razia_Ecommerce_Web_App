"use client";

import { useState, useEffect } from "react";
import SignUpForm from "@/components/SignUpForm";
import LoginForm from "@/components/LoginForm";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export default function AuthPage({ initialForm = "signup", onClose }) {
  const [showForm, setShowForm] = useState(initialForm);

  const [emailForReset, setEmailForReset] = useState("");

  useEffect(() => {
    setShowForm(initialForm);
  }, [initialForm]);

  return (
    <>
      {/* SIGNUP */}
      {showForm === "signup" && (
        <SignUpForm
          show={true}
          onClose={onClose}
          switchForm={() => setShowForm("login")}
        />
      )}

      {/* LOGIN */}
      {showForm === "login" && (
        <LoginForm
          show={true}
          onClose={onClose}
          switchForm={() => setShowForm("signup")}
          openForgot={() => setShowForm("forgot")}
        />
      )}

      {/* FORGOT PASSWORD */}
      {showForm === "forgot" && (
        <ForgotPasswordForm
          show={true}
          onClose={onClose}
          backToLogin={() => setShowForm("login")}
          goToReset={(email) => {
            setEmailForReset(email);
            setShowForm("reset");
          }}
        />
      )}

      {/* RESET PASSWORD */}
      {showForm === "reset" && (
        <ResetPasswordForm
          show={true}
          email={emailForReset}
          onClose={onClose}
          backToLogin={() => setShowForm("login")}
        />
      )}
    </>
  );
}