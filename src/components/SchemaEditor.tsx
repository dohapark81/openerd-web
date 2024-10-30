import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams, CellKeyDownEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Table, Column } from '@/types/schema';
import Button from '@/components/Button';
import { FaTrash } from 'react-icons/fa';

interface SchemaEditorProps {
  table: Table;
  onSchemaChange: (updatedTable: Table) => void;
}

const BooleanCellRenderer: React.FC<ICellRendererParams> = (props) => {
  const value = props.value === true || props.value === 'true';
  
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value === 'true';
    if (props.setValue) {
      props.setValue(newValue);
    }
  };

  return (
    <select value={value.toString()} onChange={handleChange}>
      <option value="true">True</option>
      <option value="false">False</option>
    </select>
  );
};

const SchemaEditor: React.FC<SchemaEditorProps> = ({
  table,
  onSchemaChange
}) => {
  const gridRef = useRef<any>(null);
  const [rowData, setRowData] = useState<Column[]>([]);

  const columnDefs: ColDef<Column>[] = [
    { field: 'name', headerName: 'Column Name', width: 200, editable: true, rowDrag: true },
    { field: 'type', headerName: 'Data Type', width: 150, editable: true },
    { 
      field: 'null', 
      headerName: 'Nullable', 
      width: 100, 
      cellRenderer: BooleanCellRenderer,
      cellRendererParams: { column: 'null' },
    },
    { 
      field: 'primary_key', 
      headerName: 'Primary', 
      width: 120, 
      cellRenderer: BooleanCellRenderer,
      cellRendererParams: { column: 'primary_key' },
    },
    {
      headerName: '',
      width: 100,
      cellRenderer: (params: any) => (
          <Button onClick={() => handleDelete(params.node.id)}>
            <FaTrash color="red" />
          </Button>
      )
    }
  ];

  useEffect(() => {
    setRowData(table.columns.map(col => ({ ...col }))); // 깊은 복사
  }, [table]);

  const onCellValueChanged = useCallback((event: any) => {
    const updatedColumns = rowData.map(col => 
      col.name === event.data.name 
        ? { ...col, [event.colDef.field]: event.newValue }
        : col
    );
    updateSchema(updatedColumns);
  }, [rowData]);

  const handleDelete = useCallback((id: string) => {
    const updatedColumns = rowData.filter((_, index) => index.toString() !== id);
    updateSchema(updatedColumns);
  }, [rowData]);

  const generateUniqueColumnName = (baseName: string): string => {
    let newName = baseName;
    let counter = 1;
    while (rowData.some(col => col.name === newName)) {
      newName = `${baseName}${counter}`;
      counter++;
    }
    return newName;
  };

  const handleAddColumn = useCallback(() => {
    const newColumnName = generateUniqueColumnName('New Column');
    const newColumn: Column = {
      name: newColumnName,
      logical_name: '',
      type: 'varchar',
      null: false,
      primary_key: false
    };
    const updatedColumns = [...rowData, newColumn];
    updateSchema(updatedColumns);
  }, [rowData]);

  const updateSchema = (columns: Column[]) => {
    const newColumns = columns.map(col => ({ ...col })); // 깊은 복사
    setRowData(newColumns);
    onSchemaChange({
      ...table,
      columns: newColumns
    });
  };

  const onRowDragEnd = (event: any) => {
    const updatedColumns = [...rowData]; // 기존 데이터의 복사본 생성
    event.api.forEachNode((node: any, index: number) => {
      updatedColumns[index] = { ...node.data }; // 각 항목을 깊은 복사
    });
    updateSchema(updatedColumns);
  };

  const handleKeyDown = useCallback((event: CellKeyDownEvent) => {
    if (event.event && (event.event as KeyboardEvent).key === 'Escape') {
      const gridApi = gridRef.current?.api;
      if (gridApi) {
        gridApi.stopEditing(true); // true를 전달하여 변경 사항을 취소합니다.
        event.event.preventDefault(); // 기본 ESC 동작을 방지합니다.
      }
    }
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <Button onClick={handleAddColumn}>Add Column</Button>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        onCellValueChanged={onCellValueChanged}
        animateRows={true}
        rowDragManaged={true}
        onRowDragEnd={onRowDragEnd}
        onCellKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SchemaEditor;