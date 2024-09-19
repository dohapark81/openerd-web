import { useState } from 'react';
import Canvas from '@/components/Canvas';
import Drawer from '@/components/Drawer';
import { Table } from '@/types/schema';
import SchemaEditor from '@/components/SchemaEditor';


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

export default function EditorPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tables, setTables] = useState<Table[]>(initialTables); // 초기 테이블 데이터

  const handleClickNode = (table: Table) => {
    setIsDrawerOpen(true);
    setSelectedTable(table);
  };

  function handleSchemaChange(updatedTable: Table): void {
    setSelectedTable(updatedTable);
    
    // 전체 tables 배열 업데이트
    setTables(prevTables => 
      prevTables.map(table => 
        table.name === updatedTable.name ? updatedTable : table
      )
    );
  }

  function handleClickEdge(edge: any) {
    console.log('handleClickEdge()', edge);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-grow">
        <Canvas tables={tables} width={800} height={800} onClickNode={handleClickNode} onClickEdge={handleClickEdge} />
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