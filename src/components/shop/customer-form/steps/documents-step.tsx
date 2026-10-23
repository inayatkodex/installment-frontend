import UploadTile from "@/components/common/UploadTile/UploadTile";
import { StepProps } from "../formTypes";

const DocumentsStep = ({ form, update }: StepProps) => (
  <>
    <p className="cf-help">Box dabayen aur saaf photo lein. Yeh abhi chhod bhi sakte hain.</p>
    <div className="cf-docs">
      <UploadTile label="CNIC front" labelUr="شناختی کارڈ آگے" file={form.docs.cnicFront} onChange={(f) => update({ docs: { ...form.docs, cnicFront: f } })} />
      <UploadTile label="CNIC back" labelUr="شناختی کارڈ پیچھے" file={form.docs.cnicBack} onChange={(f) => update({ docs: { ...form.docs, cnicBack: f } })} />
      <UploadTile label="Other paper" labelUr="دوسرا کاغذ" file={form.docs.other} onChange={(f) => update({ docs: { ...form.docs, other: f } })} />
    </div>
  </>
);

export default DocumentsStep;
