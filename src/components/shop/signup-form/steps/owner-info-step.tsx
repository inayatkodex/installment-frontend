import FormInput from "@/components/common/ui/FormInput";
import { maskCnic, maskMobile } from "@/shared/formatUtils";
import { SignupStepProps } from "../signupTypes";

const OwnerInfoStep = ({ form, errors, update }: SignupStepProps) => (
  <>
    <FormInput label="Your full name" labelUr="آپ کا نام" value={form.ownerName} onChange={(e) => update({ ownerName: e.target.value })} placeholder="Dukaandar ka naam" autoFocus error={errors.ownerName} />
    <FormInput label="Mobile number" labelUr="موبائل نمبر" type="tel" inputMode="numeric" value={form.mobile} onChange={(e) => update({ mobile: maskMobile(e.target.value) })} placeholder="03xx-xxxxxxx" error={errors.mobile} />
    <FormInput label="CNIC number" labelUr="شناختی کارڈ نمبر" inputMode="numeric" value={form.cnic} onChange={(e) => update({ cnic: maskCnic(e.target.value) })} placeholder="xxxxx-xxxxxxx-x" error={errors.cnic} />
    <FormInput label="Email" labelUr="ای میل" optional type="email" inputMode="email" value={form.email} onChange={(e) => update({ email: e.target.value })} placeholder="name@example.com" error={errors.email} />
    <FormInput label="Password" labelUr="پاس ورڈ" type="password" autoComplete="new-password" value={form.password} onChange={(e) => update({ password: e.target.value })} placeholder="Kam az kam 6 huroof" error={errors.password} />
  </>
);

export default OwnerInfoStep;
