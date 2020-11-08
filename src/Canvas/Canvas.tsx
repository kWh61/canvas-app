import React, { useRef } from 'react';
import { WIDTH, HEIGHT, CanvasData, mouseBehaviorWrapper } from './CanvasUtils';
import styles from './Canvas.module.css';

const Canvas: React.FC<{ mode: "rectangle"|"line"|"pen" }> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const canvasData = useRef<CanvasData>({ operationPointer: -1, operations: [] });

  return (
    <canvas
      id={styles.canvas}
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      onMouseDown={e => mouseBehaviorWrapper[mode]["down"]({canvasRef, canvasData, e})}
      onMouseMove={e => mouseBehaviorWrapper[mode]["move"]({canvasRef, canvasData, e})}
      onMouseUp={e => mouseBehaviorWrapper[mode]["up"]({canvasRef, canvasData, e})}
    ></canvas>
  );
};

export default Canvas;