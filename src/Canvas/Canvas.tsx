import React, { useRef } from 'react';
import { WIDTH, HEIGHT, CanvasData, mouseBehaviorWrapper } from './CanvasUtils';
import styles from './Canvas.module.css';
import useStore from '../GlobalStore';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const mode = useStore(state => state.mode);
  const canvasData = useStore(state => state.canvasData);
  const setCanvasData = useStore(state => state.setCanvasData);

  return (
    <canvas
      id={styles.canvas}
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      onMouseDown={e => mouseBehaviorWrapper[mode]["down"]({canvasRef, canvasData, setCanvasData, e})}
      onMouseMove={e => mouseBehaviorWrapper[mode]["move"]({canvasRef, canvasData, setCanvasData, e})}
      onMouseUp={e => mouseBehaviorWrapper[mode]["up"]({canvasRef, canvasData, setCanvasData, e})}
    ></canvas>
  );
};

export default Canvas;