import UploadTile from "@/components/common/UploadTile/UploadTile";
import { SignupStepProps } from "../signupTypes";

const SignupDocumentsStep = ({ form, errors, update }: SignupStepProps) => (
  <div className="su-profile-step">
    <p className="su-help">
      Profile photo dena zaroori nahi. Baad mein profile page se bhi add kar
      sakte hain.
    </p>
    <div className="su-profile-box">
      <UploadTile
        label="Profile photo"
        labelUr="پروفائل تصویر (ضروری نہیں)"
        hint="Camera se lein ya Gallery se chunein"
        file={form.profilePic}
        onChange={(f) => update({ profilePic: f })}
      />
    </div>
  </div>
);

export default SignupDocumentsStep;
