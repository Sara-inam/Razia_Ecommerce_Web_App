"use client";
import './styles/globals.css';
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";
import SignUpForm from "@/components/SignUpForm";
import { CartProvider } from "@/context/CartContext";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin"); // agar admin page hai

  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-800 min-h-screen flex flex-col">
        <CartProvider>
          {!isAdmin && (
            <Header 
              onLoginClick={() => setShowLogin(true)}
              onSignUpClick={() => setShowSignUp(true)} 
            />
          )}
          <main className="flex-1 pt-17 relative">{children}</main>
          {!isAdmin && <Footer />}
          <LoginForm show={showLogin} onClose={() => setShowLogin(false)} />
          <SignUpForm show={showSignUp} onClose={() => setShowSignUp(false)} />
        </CartProvider>
      </body>
    </html>
  );
}