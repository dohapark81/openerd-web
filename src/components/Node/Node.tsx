import { Table } from "../../types/schema";
import EditableField from "../../components/EditableField";

export default function Node({ table }: { table: Table }) {

  const handleClick = () => {
    alert('clicked');
  }

  const handleSave = (value: string) => {
    console.log(value);
  }

  return (
    <>
      <span onClick={handleClick} style={{fontSize: '2.0em'}}><strong>{table.logical_name} ({table.name})</strong></span>      
      <hr />
      {table.columns.map((column) => (
        <EditableField key={column.name} value={column.name + ' ' + column.type} onSave={handleSave} />
      ))}
    </>
  );
}