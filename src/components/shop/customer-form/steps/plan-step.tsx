import FormInput from "@/components/common/ui/FormInput";
import {
  formatRs,
  maskMobile,
  maskMoney,
  toNumber,
} from "@/shared/formatUtils";
import { calcPlan } from "@/shared/planUtils";
import { StepProps } from "../formTypes";

const PlanStep = ({ form, errors, update }: StepProps) => {
  const total = form.items.reduce((a, i) => a + toNumber(i.price), 0);
  const months = Number(form.months);
  const plan = calcPlan(total, toNumber(form.down), months);

  return (
    <>
      <FormInput
        label="Advance paid today (Rs.)"
        labelUr="ایڈوانس"
        optional
        inputMode="numeric"
        value={form.down}
        onChange={(e) => update({ down: maskMoney(e.target.value) })}
        placeholder="0"
        error={errors.down}
      />

      <FormInput
        label="Number of installments (months)"
        labelUr="قسطوں کے مہینے"
        type="number"
        inputMode="numeric"
        min="1"
        value={form.months}
        onChange={(e) => update({ months: e.target.value })}
        placeholder="e.g. 15"
        autoFocus
        error={errors.months}
      />

      <FormInput
        label="First installment date"
        labelUr="پہلی قسط کی تاریخ"
        type="date"
        value={form.firstDue}
        onChange={(e) => update({ firstDue: e.target.value })}
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
          <strong>{formatRs(plan.monthly)}</strong>
        </div>
        {plan.monthly > 0 && plan.last !== plan.monthly && (
          <p>Aakhri qist: {formatRs(plan.last)}</p>
        )}
      </div>
      <p className="cf-help">
        {form.name} · {maskMobile(form.mobile)} · {form.items.length} item
      </p>
    </>
  );
};

export default PlanStep;
