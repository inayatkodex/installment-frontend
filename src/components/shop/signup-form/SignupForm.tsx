"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CommonBtn from "@/components/common/CommonButton/Button";
import StepWrapper from "@/components/common/StepWrapper/StepWrapper";
import { ROUTES } from "@/constant/appRoutes";
import { shopSignup } from "@/store/slices/shop/auth/shopAuthSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { digits, isValidMobile } from "@/shared/formatUtils";
import { showToast } from "@/shared/toastUtils";
import { validateForm } from "@/shared/validationForm";
import { signupOwnerRules, signupShopRules } from "@/shared/validateRule";
import { SignupErrors, SignupFormState } from "./signupTypes";
import ShopInfoStep from "./steps/shop-info-step";
import OwnerInfoStep from "./steps/owner-info-step";
import SignupDocumentsStep from "./steps/signup-documents-step";
import SubmittedCard from "./steps/submitted-card";
import { fileToDataUrl } from "@/shared/imageUtils";
import "./signup-form.scss";

const STEPS = [
  { title: "Dukaan ki maloomat", ur: "دکان کی معلومات" },
  { title: "Aap ki maloomat", ur: "آپ کی معلومات" },
  { title: "Profile photo", ur: "پروفائل تصویر" },
];

const SignupForm = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.shopAuth.loading);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<SignupFormState>({
    shopName: "",
    city: "",
    address: "",
    ownerName: "",
    mobile: "",
    cnic: "",
    email: "",
    password: "",
    profilePic: undefined,
  });
  const update = (patch: Partial<SignupFormState>) =>
    setForm((f) => ({ ...f, ...patch }));

  const validate = (): SignupErrors => {
    if (step === 1) return validateForm({ ...form }, signupShopRules);
    if (step === 2) {
      const e = validateForm({ ...form }, signupOwnerRules, [], [], {
        password: 6,
      });
      if (!e.mobile && !isValidMobile(form.mobile))
        e.mobile =
          "Mobile number 11 digits ka hona chahiye, jaise 0300-1234567";
      if (!e.cnic && digits(form.cnic).length !== 13)
        e.cnic = "CNIC 13 digits ka hota hai";
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
        e.email = "Email sahi nahi hai";
      return e;
    }
    const e: SignupErrors = {};
    if (!form.profilePic) e.profilePic = "Apni profile photo upload karein";
    return e;
  };

  const next = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0 });
  };
  const back = () => {
    setErrors({});
    setStep((s) => s - 1);
    window.scrollTo({ top: 0 });
  };

  const submit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    try {
      const profilePic = form.profilePic
        ? await fileToDataUrl(form.profilePic)
        : undefined;
      const res = await dispatch(
        shopSignup({
          shopName: form.shopName.trim(),
          city: form.city,
          address: form.address.trim(),
          ownerName: form.ownerName.trim(),
          mobile: form.mobile,
          cnic: digits(form.cnic),
          email: form.email.trim() || undefined,
          password: form.password,
          profilePic,
        }),
      ).unwrap();
      showToast(
        typeof res === "string"
          ? res
          : "Registration ho gayi. Admin approve karega to login ho jayega.",
        "success",
      );
      setSubmitted(true);
    } catch (err) {
      showToast(
        typeof err === "string" ? err : "Registration nahi ho saki",
        "error",
      );
    }
  };

  if (submitted)
    return (
      <SubmittedCard shopName={form.shopName} ownerName={form.ownerName} />
    );

  const props = { form, errors, update };
  return (
    <div className="signup-form">
      <StepWrapper
        step={step}
        total={STEPS.length}
        title={STEPS[step - 1].title}
        titleUr={STEPS[step - 1].ur}
      >
        {step === 1 && <ShopInfoStep {...props} />}
        {step === 2 && <OwnerInfoStep {...props} />}
        {step === 3 && <SignupDocumentsStep {...props} />}
      </StepWrapper>

      <div className="su-actions">
        {step > 1 && (
          <CommonBtn
            text="Wapas"
            icon={<ArrowLeft size={20} />}
            className="gray-btn"
            onClick={back}
            ariaLabel="Pichle step par jayein"
          />
        )}
        {step < STEPS.length ? (
          <CommonBtn
            text="Aage"
            icon={<ArrowRight size={20} />}
            iconPosition="right"
            className="full-btn"
            onClick={next}
          />
        ) : (
          <CommonBtn
            text={loading ? "Ruk jayen…" : "Registration bhejein"}
            className="full-btn"
            onClick={submit}
            disabled={loading}
          />
        )}
      </div>

      <p className="su-login-link">
        Pehle se account hai? <Link href={ROUTES.SHOP.LOGIN}>Login karein</Link>
      </p>
    </div>
  );
};

export default SignupForm;
