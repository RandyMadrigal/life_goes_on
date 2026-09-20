import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Quotes from "./pages/Quotes";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

// Lazy-loaded: the admin panel's code (and its dependencies) has no reason
// to ship to every public-site visitor, only to whoever actually visits
// /admin.
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminForgotPassword = lazy(() => import("./pages/AdminForgotPassword"));
const AdminResetPassword = lazy(() => import("./pages/AdminResetPassword"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {/* Cookieless page-view analytics (Vercel). The admin panel is excluded
            so our own visits and reset-password URLs (which carry a token)
            are never recorded. */}
        <Analytics
          beforeSend={(event) =>
            new URL(event.url).pathname.startsWith("/admin") ? null : event
          }
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}
