"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, ShieldCheck, Store } from "lucide-react";
import CommonBtn from "@/components/common/CommonButton/Button";
import FormInput from "@/components/common/ui/FormInput";
import { ROUTES } from "@/constant/appRoutes";
import { adminLogin } from "@/store/slices/admin/auth/adminAuthSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { showToast } from "@/shared/toastUtils";
import { validateForm } from "@/shared/validationForm";
import { adminLoginRules } from "@/shared/validateRule";
import BrandLogo from "@/components/common/BrandLogo";
import "./signin.scss";

const FEATURES = [
  {
    Icon: Store,
    title: "Shop Status Control",
    text: "Active, Pending, Inactive, or Archived. Switch at any time.",
  },
  {
    Icon: BarChart3,
    title: "Fee Tracking",
    text: "Monitor paid and outstanding monthly platform subscription fees.",
  },
  {
    Icon: ShieldCheck,
    title: "Clean & Intuitive",
    text: "Streamlined administrative dashboard without distractions.",
  },
];

const AdminSignInPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.adminAuth.loading);
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm(form, adminLoginRules, [], ["email"]);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      await dispatch(adminLogin(form)).unwrap();
      showToast("Admin signed in successfully", "success");
      router.push(ROUTES.ADMIN.DASHBOARD);
    } catch (err) {
      const msg = typeof err === "string" ? err : "Failed to sign in";
      setErrors({ password: msg });
      showToast(msg, "error");
    }
  };

  return (
    <main className="admin-signin">
      <section className="as-hero" aria-label="Installment Pro Admin">
        <div className="as-hero-inner">
          <span className="as-badge">
            <BrandLogo size={26} variant="white" />
          </span>
          <h1>Admin Panel</h1>
          <p className="as-lead">
            Manage all shops and platform fees from a single dashboard.
          </p>
          <ul>
            {FEATURES.map(({ Icon, title, text }) => (
              <li key={title}>
                <span>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="as-form-side">
        <form className="as-form" onSubmit={handleLogin} noValidate>
          <h2>Admin Sign In</h2>
          <p className="as-sub">
            Sign in with your email and password to access the panel.
          </p>
          <div className="as-fields">
            <FormInput
              label="Email"
              type="email"
              inputMode="email"
              autoComplete="username"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@example.com"
              error={errors.email}
            />
            <FormInput
              label="Password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              error={errors.password}
            />
          </div>
          <label className="as-remember">
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={(e) =>
                setForm({ ...form, rememberMe: e.target.checked })
              }
            />
            <span>Remember me</span>
          </label>
          <CommonBtn
            type="submit"
            text={loading ? "Signing in…" : "Sign In"}
            className="full-btn"
            disabled={loading}
          />
        </form>
      </section>
    </main>
  );
};

export default AdminSignInPage;
