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
  const [nodes, setNodes] = useState<{ id: string; data: { label: JSX.Element }; position: { x: number; y: number }; style: { padding: number; border: string; borderRadius: string; backgroundColor: string } }[]>([]);
  const [edges, setEdges] = useState(initialEdges);

  const handleClickNode = (table: Table) => {
    if (onClickNode) {
      onClickNode(table);
    }
  }

  useEffect(() => {
    const newNodes = tables.map((table) => ({
      id: table.name,
      data: {
        label: <Node table={table} onClick={handleClickNode} />
      },
      position: table.position,
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
  const onEdgeClick = useCallback((_: any, edge: any) => {
    if (onClickEdge) {
      onClickEdge(edge);
    }
  }, []);
  const onNodeDragStop = useCallback((_: any, node: any) => {
    const table = tables.find((table) => table.name === node.id);

    if (table) {
      table.position = node.position;
    }
  }, [tables]);

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={onEdgeClick}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
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