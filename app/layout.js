"use client";
import "./styles/globals.css";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AuthPage from "@/app/auth/page"; // Unified Auth modal
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";


// ✅ Create a QueryClient instance outside the component
const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  // Unified auth modal state
  const [showAuth, setShowAuth] = useState(false);
  const [authForm, setAuthForm] = useState("signup"); // "signup" | "login"

  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-800 min-h-screen flex flex-col">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CartProvider>
              {/* Header */}
              {!isAdmin && (
                <Header
                  onLoginClick={() => {
                    setAuthForm("login");
                    setShowAuth(true);
                  }}
                  onSignUpClick={() => {
                    setAuthForm("signup");
                    setShowAuth(true);
                  }}
                />
              )}

              {/* Main content */}
              <main className="flex-1 pt-17 relative">{children}</main>
                <WhatsAppButton />

              {/* Footer */}
              {!isAdmin && <Footer />}

              {/* Unified Auth Modal */}
              {showAuth && (
                <AuthPage
                  initialForm={authForm}
                  onClose={() => setShowAuth(false)}
                />
              )}
            </CartProvider>
          </AuthProvider>

          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}