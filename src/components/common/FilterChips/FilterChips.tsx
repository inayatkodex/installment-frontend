import "./filterchips.scss";

interface Option { value: string; label: string; count?: number }
interface Props { options: Option[]; value: string; onChange: (v: string) => void; label?: string }

const FilterChips = ({ options, value, onChange, label = "Filter" }: Props) => (
  <div className="filter-chips" role="group" aria-label={label}>
    {options.map((o) => (
      <button key={o.value} type="button" className={value === o.value ? "on" : ""} aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
        {o.label}{o.count !== undefined && <span> {o.count}</span>}
      </button>
    ))}
  </div>
);

export default FilterChips;
