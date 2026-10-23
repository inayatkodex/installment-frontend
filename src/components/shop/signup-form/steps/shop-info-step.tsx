import FormInput from "@/components/common/ui/FormInput";
import { CITIES, SignupStepProps } from "../signupTypes";

const ShopInfoStep = ({ form, errors, update }: SignupStepProps) => (
  <>
    <FormInput label="Shop name" labelUr="دکان کا نام" value={form.shopName} onChange={(e) => update({ shopName: e.target.value })} placeholder="Jaise: Al-Rehman Electronics" autoFocus error={errors.shopName} />
    <FormInput label="City" labelUr="شہر" options={CITIES.map((c) => ({ label: c, value: c }))} value={form.city} onChange={(e) => update({ city: e.target.value })} placeholder="Apna shehar chunein" error={errors.city} />
    <FormInput label="Shop address" labelUr="دکان کا پتہ" multiline rows={2} value={form.address} onChange={(e) => update({ address: e.target.value })} placeholder="Market, gali, mohalla" error={errors.address} />
  </>
);

export default ShopInfoStep;
