"use client";

import { useEffect, useState } from "react";
import { Camera, X } from "lucide-react";
import PhotoSourceSheet from "@/components/common/PhotoSourceSheet/PhotoSourceSheet";
import FormInput from "@/components/common/ui/FormInput";
import { maskCnic, maskMobile } from "@/shared/formatUtils";
import { StepProps } from "../formTypes";

const CustomerInfoStep = ({ form, errors, update }: StepProps) => {
  const [sheet, setSheet] = useState(false);
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!form.photo) {
      setUrl(undefined);
      return;
    }
    const u = URL.createObjectURL(form.photo);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [form.photo]);

  return (
    <>
      <div className="cf-photo-top">
        <div className="cf-photo-circle-wrap">
          <button
            type="button"
            className={`cf-photo-circle ${url ? "has-img" : ""}`}
            onClick={() => setSheet(true)}
            aria-label={
              url ? "Customer ki photo badlein" : "Customer ki photo add karein"
            }
          >
            {url ? (
              <img
                src={url}
                alt="Customer preview"
                className="cf-photo-thumb"
              />
            ) : (
              <div className="cf-photo-empty">
                <Camera size={30} aria-hidden="true" />
                <span>Customer ki photo</span>
              </div>
            )}
          </button>
          {form.photo && (
            <button
              type="button"
              className="cf-photo-del"
              onClick={() => update({ photo: undefined })}
              aria-label="Customer ki photo hata dein"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <p className="cf-photo-hint">
          Customer ki photo (optional){" "}
          <span className="ur" lang="ur">
            تصویر (ضروری نہیں)
          </span>
        </p>
      </div>

      <FormInput
        label="Full name"
        labelUr="پورا نام"
        value={form.name}
        onChange={(e) => update({ name: e.target.value })}
        placeholder="Customer ka naam"
        autoComplete="off"
        autoFocus
        error={errors.name}
      />
      <FormInput
        label="Mobile number"
        labelUr="موبائل نمبر"
        type="tel"
        inputMode="numeric"
        value={form.mobile}
        onChange={(e) => update({ mobile: maskMobile(e.target.value) })}
        placeholder="03xx-xxxxxxx"
        error={errors.mobile}
      />
      <FormInput
        label="Father / husband name"
        labelUr="والد / شوہر کا نام"
        optional
        value={form.fatherName}
        onChange={(e) => update({ fatherName: e.target.value })}
        placeholder="Walid ka naam"
      />
      <FormInput
        label="CNIC number"
        labelUr="شناختی کارڈ نمبر"
        optional
        inputMode="numeric"
        value={form.cnic}
        onChange={(e) => update({ cnic: maskCnic(e.target.value) })}
        placeholder="xxxxx-xxxxxxx-x"
        error={errors.cnic}
      />
      <FormInput
        label="Address"
        labelUr="پتہ"
        optional
        value={form.address}
        onChange={(e) => update({ address: e.target.value })}
        placeholder="Ghar, mohalla, shehar"
      />

      {sheet && (
        <PhotoSourceSheet
          title="Customer ki photo"
          titleUr="کسٹمر کی تصویر"
          onPick={(file) => update({ photo: file })}
          onClose={() => setSheet(false)}
        />
      )}
    </>
  );
};

export default CustomerInfoStep;
