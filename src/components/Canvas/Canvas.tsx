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
  Connection,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {Table} from "@/types/schema";
import Node from '@/components/Node';
import CustomEdge from './CustomEdge';

const entityNodeStyle = {
  padding: 10,
  border: '1px solid #000',
  borderRadius: '3px',
  backgroundColor: '#000',
};

// 초기 edges 제거
const initialEdges: Edge[] = [];

const edgeTypes = {
  custom: CustomEdge,
};

interface CanvasProps {
  tables: Table[];
  width: number;
  height: number;
  controls?: React.ReactNode;
  onClickNode?: (table: Table) => void;
  onClickEdge?: (edge: any) => void;
  selectedEdge?: Edge | null;
  onEdgeSelect?: (edge: Edge | null) => void;
}

export default function Canvas({ 
  tables, 
  width, 
  height, 
  controls, 
  onClickNode, 
  onClickEdge,
  selectedEdge,
  onEdgeSelect 
}: CanvasProps) {
  const [nodes, setNodes] = useState<{ id: string; data: { label: JSX.Element; table: Table }; position: { x: number; y: number }; style: { padding: number; border: string; borderRadius: string; backgroundColor: string } }[]>([]);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const handleClickNode = (table: Table) => {
    if (onClickNode) {
      onClickNode(table);
    }
  }

  useEffect(() => {
    const newNodes = tables.map((table) => ({
      id: table.name,
      data: {
        label: <Node table={table} onClick={handleClickNode} />,
        table: table,
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
    (connection: Connection) => {
      // ID 생성 방식 수정
      const edgeId = `${Date.now()}-${connection.sourceHandle}-${connection.targetHandle}`;
      
      const newEdge: Edge = {
        id: edgeId,
        source: connection.source!,
        target: connection.target!,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        label: '1:N',
        type: 'custom',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        data: {
          sourceField: connection.sourceHandle?.split('__')[1],
          targetField: connection.targetHandle?.split('__')[1],
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    []
  );
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    console.log('Edge clicked:', edge);  // 디버깅을 위한 로그 추가
    if (onClickEdge) {
      onClickEdge(edge);
    }
  }, [onClickEdge]);

  const updateEdge = useCallback((updatedEdge: Edge) => {
    setEdges(eds => eds.map(ed => 
      ed.id === updatedEdge.id ? updatedEdge : ed
    ));
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
        connectOnClick={false}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        proOptions={{
          hideAttribution: true,
        }}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: 'custom',
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