"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CommonBtn from "@/components/common/CommonButton/Button";
import FormInput from "@/components/common/ui/FormInput";
import { ROUTES } from "@/constant/appRoutes";
import { shopLogin } from "@/store/slices/shop/auth/shopAuthSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { isValidMobile, maskMobile } from "@/shared/formatUtils";
import { showToast } from "@/shared/toastUtils";
import { validateForm } from "@/shared/validationForm";
import { shopLoginRules } from "@/shared/validateRule";
import BrandLogo from "@/components/common/BrandLogo";
import "./login.scss";

const ShopLoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.shopAuth.loading);
  const [form, setForm] = useState({ mobile: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm(form, shopLoginRules);
    if (!errs.mobile && !isValidMobile(form.mobile))
      errs.mobile = "Mobile number 11 digits ka hona chahiye";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      await dispatch(shopLogin({ ...form, rememberMe: true })).unwrap();
      showToast("Login ho gaya", "success");
      router.push(ROUTES.SHOP.DASHBOARD);
    } catch (err) {
      const msg = typeof err === "string" ? err : "Login nahi ho saka";
      setErrors({ password: msg });
      showToast(msg, "error");
    }
  };

  return (
    <main className="shop-login">
      <form className="shop-login-card" onSubmit={handleLogin} noValidate>
        <BrandLogo size={44} />
        <h1 className="visually-hidden">Installment Pro</h1>
        <p className="shop-login-tag">Qiston ka hisaab, aasaan tareeqe se</p>

        <div className="shop-login-fields">
          <FormInput
            label="Mobile number"
            labelUr="موبائل نمبر"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={form.mobile}
            onChange={(e) =>
              setForm({ ...form, mobile: maskMobile(e.target.value) })
            }
            placeholder="03xx-xxxxxxx"
            error={errors.mobile}
          />
          <FormInput
            label="Password"
            labelUr="پاس ورڈ"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Apna password likhein"
            error={errors.password}
          />
        </div>

        <CommonBtn
          type="submit"
          text={loading ? "Ruk jayen…" : "Login"}
          className="full-btn"
          disabled={loading}
        />

        <div className="shop-login-divider">
          <span>Naye hain?</span>
        </div>
        <Link href={ROUTES.SHOP.SIGNUP} className="shop-login-signup">
          Signup{" "}
          <span className="ur" lang="ur">
            نیا اکاؤنٹ بنائیں
          </span>
        </Link>

      </form>
    </main>
  );
};

export default ShopLoginPage;
