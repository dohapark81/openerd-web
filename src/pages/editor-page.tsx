import { useState } from 'react';
import Canvas from '../components/Canvas';
import Drawer from '../components/Drawer';
import { Table } from '../types/schema';

export default function EditorPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const handleClickNode = (table: Table) => {
    console.log(table);
    setIsDrawerOpen(true);
    setSelectedTable(table);
  };

  const fields = (selectedTable: Table | null) => {
    return selectedTable?.columns.map((column) => {
      return (
        <p key={column.name}>{column.name} {column.type} {column.logical_name}</p>
      );
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-grow">
        <Canvas width={800} height={800} onClickNode={handleClickNode} />
      </div>
      <Drawer
        title={`${selectedTable?.logical_name} (${selectedTable?.name})`}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <div>
          {fields(selectedTable)}
        </div>
      </Drawer>
    </div>
  );
}