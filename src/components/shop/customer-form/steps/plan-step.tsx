import FormInput from "@/components/common/ui/FormInput";
import DatePartsPicker from "@/components/common/ui/DatePartsPicker";
import {
  formatRs,
  maskMobile,
  maskMoney,
  toNumber,
} from "@/shared/formatUtils";
import {
  calcPlan,
  MAX_SCHEDULE_INSTALLMENTS,
} from "@/shared/planUtils";
import { StepProps } from "../formTypes";

const PlanStep = ({ form, errors, update }: StepProps) => {
  const total = form.items.reduce((a, i) => a + toNumber(i.price), 0);
  const monthlyPayment = toNumber(form.monthlyPayment);
  const plan = calcPlan(total, toNumber(form.down), monthlyPayment);

  return (
    <>
      <FormInput
        label="Advance paid today (Rs.)"
        labelUr="ایڈوانس"
        inputMode="numeric"
        value={form.down}
        onChange={(e) => update({ down: maskMoney(e.target.value) })}
        placeholder="0"
        error={errors.down}
      />
      <p className="cf-help">
        Advance na diya ho to 0 likhein, warna di hui raqam likhein.
      </p>

      <FormInput
        label="Monthly installment amount (Rs.)"
        labelUr="ماہانہ قسط"
        inputMode="numeric"
        value={form.monthlyPayment}
        onChange={(e) =>
          update({ monthlyPayment: maskMoney(e.target.value) })
        }
        placeholder="Misal: 2000"
        autoFocus
        error={errors.monthlyPayment}
      />
      <p className="cf-help">
        Har mahine customer se jitni raqam leni hai woh likhein.
      </p>

      <DatePartsPicker
        label="First installment date"
        labelUr="پہلی قسط کی تاریخ"
        value={form.firstDue}
        onChange={(firstDue) => update({ firstDue })}
        error={errors.firstDue}
      />

      <div className="cf-summary" aria-live="polite">
        <div>
          <span>Total price</span>
          <b>{formatRs(total)}</b>
        </div>
        <div>
          <span>Advance</span>
          <b>{formatRs(toNumber(form.down))}</b>
        </div>
        <div>
          <span>Baaki raqam</span>
          <b>{formatRs(plan.remaining)}</b>
        </div>
        <div className="cf-monthly">
          <span>
            Har mahine{" "}
            <span className="ur" lang="ur">
              ماہانہ قسط
            </span>
          </span>
          <strong>
            {plan.monthly > 0 ? formatRs(plan.monthly) : "—"}
          </strong>
        </div>
        {plan.installments > 0 && (
          <p>
            Taqreeban {plan.installments} qistein · Aakhri qist:{" "}
            {formatRs(plan.last)}
          </p>
        )}
        {plan.installments > MAX_SCHEDULE_INSTALLMENTS && (
          <p>Qist ki raqam barha kar schedule ko chhota karein.</p>
        )}
      </div>
      <p className="cf-help">
        {form.name} · {maskMobile(form.mobile)} · {form.items.length} item
      </p>
    </>
  );
};

export default PlanStep;
