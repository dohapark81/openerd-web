import { Handle, Position } from '@xyflow/react';
import { Table } from "@/types/schema";

interface NodeProps {
  table: Table;
  onClick?: (table: Table) => void;
  selectedColumnIds?: string[]; // 선택된 컬럼 ID 배열
}

export default function Node({ table, onClick, selectedColumnIds = [] }: NodeProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(table);
    }
  }

  return (
    <div onClick={handleClick}>
      <span style={{fontSize: '2.0em', color: 'white'}}><strong>{table.logical_name} ({table.name})</strong></span>      
      <hr />
      {table.columns.map((column) => {
        const columnId = `${table.name}__${column.name}`;
        const isSelected = selectedColumnIds.includes(columnId);
        
        return (
          <div 
            key={column.name} 
            className={`flex items-center py-1 px-2 ${
              isSelected ? 'bg-blue-900' : 'hover:bg-gray-800'
            }`}
          >
            <div className="w-3 h-3 relative">
              <Handle
                type="target"
                position={Position.Left}
                id={columnId}
                className="!w-3 !h-3 !bg-blue-400 hover:!bg-blue-300 cursor-crosshair"
              />
            </div>
            <span style={{color: 'white'}} className="flex-1 mx-4">
              {column.name} {column.type} {column.logical_name}
            </span>
            <div className="w-3 h-3 relative">
              <Handle
                type="source"
                position={Position.Right}
                id={columnId}
                className="!w-3 !h-3 !bg-blue-400 hover:!bg-blue-300 cursor-crosshair"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}