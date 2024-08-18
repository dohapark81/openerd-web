import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

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
    source: '1',
    target: '2',
    label: '1:N',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

const ERDComponent = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

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
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default ERDComponent;