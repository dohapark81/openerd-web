import { Edge } from '@xyflow/react';
import { Table } from '@/types/schema';

interface RelationEditorProps {
  edge: Edge;
  tables: Table[];
  onUpdate: (edge: Edge) => void;
}

export default function RelationEditor({ edge, tables, onUpdate }: RelationEditorProps) {
  const sourceTable = tables.find(t => t.name === edge?.source);
  const targetTable = tables.find(t => t.name === edge?.target);
  
  const handleRelationTypeChange = (type: string) => {
    const updatedEdge = {
      ...edge,
      label: type,
      data: {
        ...edge?.data,
        relationType: type
      }
    };
    onUpdate(updatedEdge);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">Relation Editor</h3>
      <div className="mb-4">
        <p>From: {sourceTable?.name}.{edge.data?.sourceField as string}</p>
        <p>To: {targetTable?.name}.{edge.data?.targetField as string}</p>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => handleRelationTypeChange('1:1')}
          className={`px-3 py-1 border rounded ${edge?.label === '1:1' ? 'bg-blue-500 text-white' : ''}`}
        >
          1:1
        </button>
        <button 
          onClick={() => handleRelationTypeChange('1:N')}
          className={`px-3 py-1 border rounded ${edge?.label === '1:N' ? 'bg-blue-500 text-white' : ''}`}
        >
          1:N
        </button>
        <button 
          onClick={() => handleRelationTypeChange('N:M')}
          className={`px-3 py-1 border rounded ${edge?.label === 'N:M' ? 'bg-blue-500 text-white' : ''}`}
        >
          N:M
        </button>
      </div>
    </div>
  );
}
