import { ReactNode } from "react";
import "./datatable.scss";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  primary?: boolean; // used as the card title on phones
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
}

/** Table on desktop. Turns into simple cards on phones (no sideways scrolling). */
function DataTable<T>({ columns, rows, rowKey, onRowClick }: Props<T>) {
  const primary = columns.find((c) => c.primary) ?? columns[0];
  const others = columns.filter((c) => c !== primary);

  return (
    <div className="data-table">
      <div className="dt-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={rowKey(r)}
                className={onRowClick ? "clickable" : ""}
                onClick={() => onRowClick?.(r)}
              >
                {columns.map((c) => (
                  <td key={c.key}>{c.render(r)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="dt-cards">
        {rows.map((r) => (
          <li
            key={rowKey(r)}
            className={onRowClick ? "clickable" : ""}
            onClick={() => onRowClick?.(r)}
          >
            <div className="dt-card-title">{primary.render(r)}</div>
            {others.map((c) => (
              <div key={c.key} className="dt-card-row">
                <span>{c.header}</span>
                <span>{c.render(r)}</span>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataTable;
