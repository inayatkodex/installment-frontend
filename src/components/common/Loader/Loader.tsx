import "./loader.scss";

const Loader = ({ text = "Ruk jayen…" }: { text?: string }) => (
  <div className="loader-wrap" role="status" aria-live="polite">
    <span className="loader-spinner" />
    <span className="loader-text">{text}</span>
  </div>
);

export default Loader;
