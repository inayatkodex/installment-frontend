import FormInput from "@/components/common/ui/FormInput";
import DatePartsPicker from "@/components/common/ui/DatePartsPicker";
import { formatRs, maskMoney, toNumber } from "@/shared/formatUtils";
import { calcPlan, MAX_SCHEDULE_INSTALLMENTS } from "@/shared/planUtils";
import { StepProps } from "../formTypes";

const PlanStep = ({ form, errors, update, clearError }: StepProps) => {
  const total = form.items.reduce((a, i) => a + toNumber(i.price), 0);
  const monthlyPayment = toNumber(form.monthlyPayment);
  const plan = calcPlan(total, toNumber(form.down), monthlyPayment);

  return (
    <div className="cf-plan-step">
      <div className="cf-plan-total">
        <span>Kul qeemat</span>
        <strong>{formatRs(total)}</strong>
      </div>

      <FormInput
        label="Advance (Rs.)"
        labelUr="ایڈوانس"
        inputMode="numeric"
        value={form.down}
        onChange={(e) => {
          update({ down: maskMoney(e.target.value) });
          clearError("down");
        }}
        placeholder="Misal: 10,000"
        error={errors.down}
      />
      <p className="cf-plan-hint">Advance na mila ho to khali chhor dein.</p>

      <FormInput
        label="Mahana qist (Rs.)"
        labelUr="ماہانہ قسط"
        inputMode="numeric"
        value={form.monthlyPayment}
        onChange={(e) => {
          update({ monthlyPayment: maskMoney(e.target.value) });
          clearError("monthlyPayment");
        }}
        placeholder="Misal: 2,000"
        autoFocus
        error={errors.monthlyPayment}
      />
      <DatePartsPicker
        label="Pehli qist ki tareekh"
        labelUr="پہلی قسط کی تاریخ"
        value={form.firstDue}
        onChange={(firstDue) => {
          update({ firstDue });
          clearError("firstDue");
        }}
        error={errors.firstDue}
      />

      <section className="cf-plan-summary" aria-live="polite" aria-label="Qiston ka hisaab">
        <h3>Hisaab</h3>
        <div className="cf-plan-summary-row">
          <span>Advance</span>
          <b>{formatRs(toNumber(form.down))}</b>
        </div>
        <div className="cf-plan-summary-row cf-plan-remaining">
          <span>Qiston mein baqi raqam</span>
          <b>{formatRs(plan.remaining)}</b>
        </div>
        {plan.remaining === 0 ? (
          <p className="cf-plan-result">
            Advance se poori qeemat ada ho gayi; qistein nahi banengi.
          </p>
        ) : plan.installments > 0 ? (
          <div className="cf-plan-result">
            <strong>
              {plan.installments} qistein · {formatRs(monthlyPayment)} mahana
            </strong>
            <span>
              Aakhri qist: <b>{formatRs(plan.last)}</b>
            </span>
          </div>
        ) : (
          <p className="cf-plan-result">
            Mahana qist likhein.
          </p>
        )}
        {plan.installments > MAX_SCHEDULE_INSTALLMENTS && (
          <p className="cf-plan-limit">
            Mahana qist barha dein. Qistein 1,200 se zyada nahi ho sakti.
          </p>
        )}
      </section>
    </div>
  );
};

export default PlanStep;
