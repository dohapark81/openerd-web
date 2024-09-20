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
import {Table} from "@/types/schema";
import Node from '@/components/Node';

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

interface CanvasProps {
  tables: Table[];
  width: number;
  height: number;
  controls?: React.ReactNode;
  onClickNode?: (table: Table) => void;
  onClickEdge?: (edge: any) => void;
}

export default function Canvas({ tables, width, height, controls, onClickNode, onClickEdge }: CanvasProps) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const handleClickNode = (table: Table) => {
    if (onClickNode) {
      onClickNode(table);
    }
  }

  useEffect(() => {
    const newNodes = tables.map((table, index) => ({
      id: table.name,
      data: {
        label: <Node table={table} onClick={handleClickNode} />
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
  const onEdgeClick = useCallback((event: any, edge: any) => {
    if (onClickEdge) {
      onClickEdge(edge);
    }
  }, []);

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={onEdgeClick}
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
          {controls}
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