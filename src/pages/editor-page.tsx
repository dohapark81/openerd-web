import { useState } from 'react';
import { create } from 'zustand';
import Canvas from '@/components/Canvas';
import Drawer from '@/components/Drawer';
import { Table } from '@/types/schema';
import SchemaEditor from '@/components/SchemaEditor';
import Button from '@/components/Button';
import { Toolbar, ToolbarButton } from '@radix-ui/react-toolbar';
import { MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, Menubar } from '@radix-ui/react-menubar';
import { CursorArrowIcon, HandIcon, MagnifyingGlassIcon, Pencil1Icon, TableIcon } from '@radix-ui/react-icons';

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
    comment: 'Stores user account information',
    position: { x: 10, y: 10 },
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
    comment: 'Stores user posts',
    position: { x: 10, y: 250 },
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
  addTable: (newTable: Table) => void;
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
  canRedo: () => get().future.length > 0,

  addTable: (newTable: Table) => set((state) => ({
    tables: [...state.tables, newTable]
  })),
}));

export default function EditorPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const {
    tables,
    selectedTable,
    setSelectedTable,
    updateTable,
    addTable,
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
    console.log('handleSchemaChange()', updatedTable);
    updateTable(updatedTable);
  }

  function handleClickEdge(edge: any) {
    console.log('handleClickEdge()', edge);
  }

  function handleAddTable() {
    const newTable: Table = {
      name: `table-${tables.length + 1}`,
      logical_name: `Table${tables.length + 1}`,
      columns: [],
      schema: '',
      charset: '',
      collate: '',
      index: {},
      engine: '',
      position: { x: 10, y: 10 },
    };
    addTable(newTable);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Menubar className="p-2 border-b">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
            <MenubarItem>Open</MenubarItem>
            <MenubarItem>Save</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={undo} disabled={!canUndo()}>Undo</MenubarItem>
            <MenubarItem onSelect={redo} disabled={!canRedo()}>Redo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Zoom In</MenubarItem>
            <MenubarItem>Zoom Out</MenubarItem>
            <MenubarItem>Fit View</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      
      <div className="flex flex-grow">
      <Toolbar className="flex flex-col p-2 border-r" orientation="vertical">
          <ToolbarButton className="p-2 mb-2" aria-label="Select">
            <CursorArrowIcon />
          </ToolbarButton>
          <ToolbarButton className="p-2 mb-2" aria-label="Pan">
            <HandIcon />
          </ToolbarButton>
          <ToolbarButton className="p-2 mb-2" aria-label="Zoom">
            <MagnifyingGlassIcon />
          </ToolbarButton>
          <ToolbarButton className="p-2 mb-2" aria-label="Add Table" onClick={handleAddTable}>
            <TableIcon />
          </ToolbarButton>
          <ToolbarButton className="p-2 mb-2" aria-label="Edit">
            <Pencil1Icon />
          </ToolbarButton>
        </Toolbar>
        
        <div className="flex-grow">
          <Canvas 
            tables={tables} 
            width={800} 
            height={800} 
            onClickNode={handleClickNode} 
            onClickEdge={handleClickEdge} 
            controls={<>
              <Button onClick={undo} disabled={!canUndo()}>Undo</Button>
              <Button onClick={redo} disabled={!canRedo()}>Redo</Button>
            </>}
          />
        </div>
      </div>

      {selectedTable && (
        <Drawer 
          title={<>
            {selectedTable.logical_name} ({selectedTable.name})
          </>} 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)}
        >
          <SchemaEditor table={selectedTable} onSchemaChange={handleSchemaChange} />
        </Drawer>
      )}
    </div>
  );
}