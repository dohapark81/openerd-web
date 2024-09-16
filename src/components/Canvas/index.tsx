import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {Table} from "../../types/schema";
import Node from '../Node';

const entityNodeStyle = {
  padding: 10,
  border: '1px solid #000',
  borderRadius: '3px',
  backgroundColor: '#000',
};

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { 
      label: (
        <>
          <strong>User</strong>
          <hr />
          <div>id: int</div>
          <div>username: varchar</div>
          <div>email: varchar</div>
        </>
      )
    },
    position: { x: 250, y: 0 },
    style: entityNodeStyle,
  },
  {
    id: '2',
    data: { 
      label: (
        <>
          <strong>Post</strong>
          <hr />
          <div>id: int</div>
          <div>title: varchar</div>
          <div>content: text</div>
          <div>user_id: int</div>
        </>
      )
    },
    position: { x: 250, y: 200 },
    style: entityNodeStyle,
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: 'users',
    target: 'posts',
    label: '1:N',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

const tables = [
  {
    schema: 'userdb',
    name: 'users',
    logical_name: 'User',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    columns: [
      {
        name: 'id',
        type: 'bigint',
        unsigned: true,
        auto_increment: true,
        null: false
      },
      {
        name: 'username',
        type: 'varchar(50)',
        null: false
      },
      {
        name: 'email',
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
        type: 'bigint',
        unsigned: true,
        auto_increment: true,
        null: false
      },
      {
        name: 'title',
        type: 'varchar(50)',
        null: false
      },
      {
        name: 'content',
        type: 'text',
        null: false
      },
      {
        name: 'author_id',
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

export default function Canvas() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  useEffect(() => {
    const newNodes = tables.map((table, index) => ({
      id: table.name,
      data: {
        label: <Node table={table} />
      },
      position: { x: 10, y: 250*index+10 },
      style: entityNodeStyle,
    }));

    setNodes(newNodes);
  }, [tables]);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (changes: any) => setEdges((eds) => addEdge(changes, eds)),
    []
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView={false}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Controls
          position="bottom-left"
          orientation="horizontal"
          showZoom={false}
          showFitView={false}
          showInteractive={false}
          className="!shadow-none"
        >
          <button
            className="size-11 bg-pink-600 p-2 hover:bg-pink-500"
          >
          </button>
        </Controls>
        <MiniMap
          style={{
            width: 100,
            height: 100,
          }}
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
        />
      </ReactFlow>
    </div>
  );
}