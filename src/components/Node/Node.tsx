import { Table } from "@/types/schema";

interface NodeProps {
  table: Table;
  onClick?: (table: Table) => void;
}

export default function Node({ table, onClick }: NodeProps) {

  const handleClick = () => {
    if (onClick) {
      onClick(table);
    }
  }

  return (
    <div onClick={handleClick}>
      <span style={{fontSize: '2.0em', color: 'white'}}><strong>{table.logical_name} ({table.name})</strong></span>      
      <hr />
      {table.columns.map((column) => (
        <div key={column.name}>
          <span style={{color: 'white'}}>
            {column.name} {column.type} {column.logical_name}
          </span>
          <br />
        </div>
      ))}
    </div>
  );
}