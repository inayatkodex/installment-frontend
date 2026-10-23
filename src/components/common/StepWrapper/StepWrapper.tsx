import { ReactNode } from "react";
import "./steps.scss";

interface Props {
  step: number;
  total: number;
  title: string;
  titleUr: string;
  children: ReactNode;
}

const StepWrapper = ({ step, total, title, titleUr, children }: Props) => (
  <section className="step-wrapper">
    <div className="step-top">
      <span>Step {step} of {total}</span>
      <span className="ur" lang="ur">مرحلہ {step} از {total}</span>
    </div>
    <div className="step-bar" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={total} aria-label={`Step ${step} of ${total}`}>
      {Array.from({ length: total }, (_, i) => <i key={i} className={i < step ? "on" : ""} />)}
    </div>
    <h1 className="step-title">{title}</h1>
    <p className="step-title-ur ur" lang="ur">{titleUr}</p>
    <div className="step-body">{children}</div>
  </section>
);

export default StepWrapper;
