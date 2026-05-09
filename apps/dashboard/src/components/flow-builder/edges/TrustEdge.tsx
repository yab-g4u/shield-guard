
import React from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';

export const TrustEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  sourceHandleId,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  let strokeColor = '#00D4FF';
  if (sourceHandleId === 'true') strokeColor = '#00FF88';
  if (sourceHandleId === 'false') strokeColor = '#FF4444';

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ 
          ...style, 
          stroke: strokeColor, 
          strokeOpacity: 0.6, 
          strokeWidth: 2 
        }} 
      />
      
      {/* Animated Dot */}
      <circle r="3" fill={strokeColor}>
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>

      {label && (
        <foreignObject
          width={40}
          height={20}
          x={labelX - 20}
          y={labelY - 10}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className="flex items-center justify-center w-full h-full">
             <div 
               className="px-1.5 py-0.5 rounded-[4px] text-[8px] font-bold border"
               style={{ 
                backgroundColor: `${strokeColor}20`, 
                borderColor: `${strokeColor}40`,
                color: strokeColor
               }}
             >
                {label}
             </div>
          </div>
        </foreignObject>
      )}
    </>
  );
};
