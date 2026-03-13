"use client";

import "./styles/globals.css";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";
import SignUpForm from "@/components/SignUpForm";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-800 min-h-screen flex flex-col">
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            {!isAdmin && (
              <Header
                onLoginClick={() => setShowLogin(true)}
                onSignUpClick={() => setShowSignUp(true)}
              />
            )}

            <main className="flex-1 pt-17 relative">{children}</main>

            {!isAdmin && <Footer />}

            <LoginForm
              show={showLogin}
              onClose={() => setShowLogin(false)}
            />

            <SignUpForm
              show={showSignUp}
              onClose={() => setShowSignUp(false)}
            />
          </CartProvider>

          {/* Devtools only in development */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}