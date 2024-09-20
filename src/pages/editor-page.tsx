import { useState } from 'react';
import { create } from 'zustand'; // 수정된 부분
import Canvas from '@/components/Canvas';
import Drawer from '@/components/Drawer';
import { Table } from '@/types/schema';
import SchemaEditor from '@/components/SchemaEditor';
import Button from '@/components/Button';

const initialTables = [
  {
    schema: 'userdb',
    name: 'users',
    logical_name: 'User',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    columns: [
      {
        name: 'id',
        primary_key: true,
        type: 'bigint',
        unsigned: true,
        auto_increment: true,
        null: false
      },
      {
        name: 'username',
        primary_key: false,
        type: 'varchar(50)',
        null: false
      },
      {
        name: 'email',
        primary_key: false,
        type: 'varchar(255)',
        null: false
      }
    ],
    index: {
      idx_username: {
        columns: ['username'],
        unique: true
      },
      idx_email: {
        columns: ['email'],
        unique: true
      }
    },
    engine: 'InnoDB',
    comment: 'Stores user account information'
  },
  {
    schema: 'userdb',
    name: 'posts',
    logical_name: 'Post',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    columns: [
      {
        name: 'id',
        primary_key: true,
        type: 'bigint',
        unsigned: true,
        auto_increment: true,
        null: false
      },
      {
        name: 'title',
        primary_key: false,
        type: 'varchar(50)',
        null: false
      },
      {
        name: 'content',
        primary_key: false,
        type: 'text',
        null: false
      },
      {
        name: 'author_id',
        primary_key: false,
        type: 'bigint',
        unsigned: true,
        null: false
      }
    ],
    index: {
      idx_username: {
        columns: ['id'],
        unique: true
      }
    },
    engine: 'InnoDB',
    comment: 'Stores user posts'
  }
] as Table[];

// Zustand store 정의
interface ERDState {
  tables: Table[];
  selectedTable: Table | null;
  past: Table[][];
  future: Table[][];
  setSelectedTable: (table: Table | null) => void;
  updateTable: (updatedTable: Table) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const useERDStore = create<ERDState>()((set, get) => ({
  tables: initialTables, // initialTables는 기존 코드에서 정의한 초기 테이블 데이터입니다.
  selectedTable: null,
  past: [],
  future: [],

  setSelectedTable: (table) => set({ selectedTable: table }),

  updateTable: (updatedTable) => set((state) => {
    const newTables = state.tables.map(table => 
      table.name === updatedTable.name ? updatedTable : table
    );
    return {
      tables: newTables,
      selectedTable: updatedTable,
      past: [...state.past, state.tables],
      future: []
    };
  }),

  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    return {
      tables: previous,
      past: state.past.slice(0, -1),
      future: [state.tables, ...state.future],
      selectedTable: null
    };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    return {
      tables: next,
      past: [...state.past, state.tables],
      future: state.future.slice(1),
      selectedTable: null
    };
  }),

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0
}));

export default function EditorPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { 
    tables, 
    selectedTable, 
    setSelectedTable, 
    updateTable, 
    undo, 
    redo,
    canUndo,
    canRedo
  } = useERDStore();

  const handleClickNode = (table: Table) => {
    setIsDrawerOpen(true);
    setSelectedTable(table);
  };

  function handleSchemaChange(updatedTable: Table): void {
    updateTable(updatedTable);
  }

  function handleClickEdge(edge: any) {
    console.log('handleClickEdge()', edge);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-grow">
        <Canvas 
          tables={tables} 
          width={800} 
          height={800} 
          onClickNode={handleClickNode} 
          onClickEdge={handleClickEdge}
          controls={
            <>
              <Button onClick={undo} disabled={!canUndo()}>Undo</Button>
              <Button onClick={redo} disabled={!canRedo()}>Redo</Button>
            </>
          }
        />
      </div>

      {selectedTable && 
        <Drawer
          title={
            <>
              {selectedTable.logical_name} ({selectedTable.name})
            </>
          }
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        >
          <SchemaEditor table={selectedTable} onSchemaChange={handleSchemaChange} />
        </Drawer>
      }
    </div>
  );
}