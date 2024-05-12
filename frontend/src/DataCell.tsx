import { ReactNode } from "react";

const DataCell = ({ children }: { children?: ReactNode }) => {
  return <div className="account-data-cell">{children}</div>;
};

export default DataCell;
