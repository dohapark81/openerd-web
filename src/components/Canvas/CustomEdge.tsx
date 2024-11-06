import { BaseEdge, EdgeProps, getSmoothStepPath } from '@xyflow/react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  label,
  data
}: EdgeProps) {
  // 엣지 ID를 기반으로 오프셋 계산 (겹치는 엣지들이 서로 어긋나도록)
  const offset = (parseInt(id.split('-')[0], 36) % 3) * 20;
  
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    offset, // 오프셋 적용
    borderRadius: 5, // 모서리 라운딩
  });

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeWidth: 2,
          stroke: '#555',
        }} 
      />
      {label && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          alignmentBaseline="middle"
          style={{ 
            fill: '#666', 
            fontSize: '12px',
            fontWeight: 'bold',
            backgroundColor: 'white',
            padding: '2px'
          }}
          className="nodrag nopan"
        >
          {label}
        </text>
      )}
    </>
  );
}
