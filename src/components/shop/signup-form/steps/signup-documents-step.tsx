import UploadTile from "@/components/common/UploadTile/UploadTile";
import { SignupStepProps } from "../signupTypes";

const SignupDocumentsStep = ({ form, errors, update }: SignupStepProps) => (
  <div className="su-profile-step">
    <p className="su-help">Apni saaf profile photo upload karein ya camera se lein. Admin yeh dekh kar aap ki dukaan approve karega.</p>
    <div className="su-profile-box">
      <UploadTile
        label="Profile photo"
        labelUr="پروفائل تصویر"
        hint="Camera se lein ya Gallery se chunein"
        file={form.profilePic}
        onChange={(f) => update({ profilePic: f })}
      />
    </div>
    {errors.profilePic && <p className="su-error" role="alert">{errors.profilePic}</p>}
  </div>
);

export default SignupDocumentsStep;
