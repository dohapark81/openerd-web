import { Table } from "../../types/schema";

export default function Node({ table }: { table: Table }) {
  return (
    <>
      <strong>{table.name}</strong>
      <hr />
      {Object.entries(table.column).map(([key, value]) => (
        <div key={key}>{key}: {value.type}</div>
      ))}
    </>
  );
}