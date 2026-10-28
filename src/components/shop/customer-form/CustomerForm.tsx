"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import CommonBtn from "@/components/common/CommonButton/Button";
import StepWrapper from "@/components/common/StepWrapper/StepWrapper";
import { ROUTES } from "@/constant/appRoutes";
import { createCustomer } from "@/store/slices/shop/customers/shopCustomersSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  digits,
  formatRs,
  isValidMobile,
  toNumber,
} from "@/shared/formatUtils";
import { fileToDataUrl } from "@/shared/imageUtils";
import { calcPlan, defaultFirstDue } from "@/shared/planUtils";
import { showToast } from "@/shared/toastUtils";
import { CustomerFormState, FormErrors } from "./formTypes";
import CustomerInfoStep from "./steps/customer-info-step";
import DocumentsStep from "./steps/documents-step";
import ItemsStep from "./steps/items-step";
import PlanStep from "./steps/plan-step";
import "./customer-form.scss";

const STEPS = [
  { title: "Customer details", ur: "کسٹمر کی معلومات" },
  { title: "Photos (optional)", ur: "تصاویر (ضروری نہیں)" },
  { title: "Kya khareeda?", ur: "کیا خریدا؟" },
  { title: "Qiston ka plan", ur: "قسطوں کا پلان" },
];

const emptyForm = (): CustomerFormState => ({
  name: "",
  fatherName: "",
  mobile: "",
  cnic: "",
  address: "",
  photo: undefined,
  docs: {},
  items: [{ key: 1, name: "", price: "" }],
  down: "",
  months: "",
  firstDue: defaultFirstDue(),
});

const CustomerForm = () => {
  const dispatch = useAppDispatch();
  const creating = useAppSelector((s) => s.shopCustomers.creating);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CustomerFormState>(emptyForm());
  const [errors, setErrors] = useState<FormErrors>({});
  const [savedId, setSavedId] = useState<string | null>(null);

  const update = (patch: Partial<CustomerFormState>) =>
    setForm((f) => ({ ...f, ...patch }));
  const total = form.items.reduce((a, i) => a + toNumber(i.price), 0);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (step === 1) {
      if (form.name.trim().length < 2) e.name = "Customer ka naam likhein";
      if (!isValidMobile(form.mobile))
        e.mobile =
          "Mobile number 11 digits ka hona chahiye, jaise 0300-1234567";
      if (form.cnic && digits(form.cnic).length !== 13)
        e.cnic =
          "CNIC 13 digits ka hota hai. Aap isay khali bhi chhod sakte hain";
    }
    if (step === 3) {
      form.items.forEach((i) => {
        if (!i.name.trim()) e[`n${i.key}`] = "Item ka naam likhein";
        if (toNumber(i.price) <= 0) e[`p${i.key}`] = "Qeemat likhein";
      });
    }
    if (step === 4) {
      if (!form.down.trim())
        e.down = "Advance ki raqam likhein; advance na ho to 0 likhein";
      if (
        !/^\d+$/.test(form.months) ||
        !Number.isSafeInteger(Number(form.months)) ||
        Number(form.months) < 1
      )
        e.months =
          "Mahino ki tadaad 1 ya us se zyada poora number honi chahiye";
      if (toNumber(form.down) > total)
        e.down = "Advance kul qeemat se zyada nahi ho sakta";
      if (!form.firstDue) e.firstDue = "Pehli qist ki tareekh chunein";
    }
    return e;
  };

  const goNext = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0 });
  };
  const goBack = () => {
    setErrors({});
    setStep((s) => s - 1);
    window.scrollTo({ top: 0 });
  };

  const save = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    try {
      const photo = form.photo ? await fileToDataUrl(form.photo) : undefined;
      const items = await Promise.all(
        form.items.map(async (i) => ({
          name: i.name.trim(),
          price: toNumber(i.price),
          photo: i.photo ? await fileToDataUrl(i.photo) : undefined,
        })),
      );
      const documents = {
        cnicFront: form.docs.cnicFront
          ? await fileToDataUrl(form.docs.cnicFront)
          : undefined,
        cnicBack: form.docs.cnicBack
          ? await fileToDataUrl(form.docs.cnicBack)
          : undefined,
        other: form.docs.other
          ? await fileToDataUrl(form.docs.other)
          : undefined,
      };
      const res = await dispatch(
        createCustomer({
          name: form.name.trim(),
          photo,
          fatherName: form.fatherName.trim() || undefined,
          mobile: form.mobile,
          cnic: digits(form.cnic) || undefined,
          address: form.address.trim() || undefined,
          items,
          downPayment: toNumber(form.down),
          months: Number(form.months),
          firstDueDate: form.firstDue,
          documents,
        }),
      ).unwrap();
      setSavedId(res.id);
    } catch (err) {
      showToast(
        typeof err === "string"
          ? err
          : "Save nahi ho saka. Internet check karke dobara dabayen.",
        "error",
      );
    }
  };

  if (savedId) {
    const plan = calcPlan(total, toNumber(form.down), Number(form.months));
    return (
      <div className="cf-done" role="status">
        <span className="cf-tick">
          <Check size={40} aria-hidden="true" />
        </span>
        <h1>Customer save ho gaya</h1>
        <p className="ur" lang="ur">
          کسٹمر محفوظ ہو گیا
        </p>
        <div className="cf-card cf-done-card">
          <div>
            <span>Customer</span>
            <b>{form.name}</b>
          </div>
          <div>
            <span>Har mahine</span>
            <b>{formatRs(plan.monthly)}</b>
          </div>
          <div>
            <span>Pehli qist</span>
            <b>{form.firstDue}</b>
          </div>
        </div>
        <Link
          href={ROUTES.SHOP.CUSTOMER_DETAIL(savedId)}
          className="cf-link-primary"
        >
          Customer dekhein
        </Link>
        <CommonBtn
          text="Ek aur customer add karein"
          className="outline-btn full-btn"
          onClick={() => {
            setForm(emptyForm());
            setStep(1);
            setSavedId(null);
          }}
        />
        <Link href={ROUTES.SHOP.CUSTOMERS} className="cf-link">
          Customers ki list
        </Link>
      </div>
    );
  }

  const stepProps = { form, errors, update };
  const hasDocs = Object.values(form.docs).some(Boolean);

  return (
    <div className="customer-form">
      <StepWrapper
        step={step}
        total={STEPS.length}
        title={STEPS[step - 1].title}
        titleUr={STEPS[step - 1].ur}
      >
        {step === 1 && <CustomerInfoStep {...stepProps} />}
        {step === 2 && <DocumentsStep {...stepProps} />}
        {step === 3 && <ItemsStep {...stepProps} />}
        {step === 4 && <PlanStep {...stepProps} />}
      </StepWrapper>

      <div className="cf-actions">
        {step > 1 && (
          <CommonBtn
            text="Wapas"
            icon={<ArrowLeft size={20} />}
            className="gray-btn"
            onClick={goBack}
            ariaLabel="Pichle step par jayein"
          />
        )}
        {step < STEPS.length ? (
          <CommonBtn
            text={step === 2 && !hasDocs ? "Skip" : "Next"}
            icon={<ArrowRight size={20} />}
            iconPosition="right"
            className="full-btn"
            onClick={goNext}
          />
        ) : (
          <CommonBtn
            text={creating ? "Ruk jayen…" : "Customer save karein"}
            className="full-btn"
            onClick={save}
            disabled={creating}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerForm;
