import React from 'react';
import { mouseBehaviorWrapper } from './CanvasUtils';
import styles from './Canvas.module.css';
import useStore from '../GlobalStore';

const Canvas: React.FC<{ canvasRef: React.MutableRefObject<HTMLCanvasElement | null> }> = ({ canvasRef }) => {
  const mode = useStore(state => state.mode);
  const { width, height } = useStore(state => state.canvasSize);
  const canvasData = useStore(state => state.canvasData);
  const setCanvasData = useStore(state => state.setCanvasData);

  return (
    <canvas
      id={styles.canvas}
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={e => mouseBehaviorWrapper[mode]["down"]({width, height, canvasRef, canvasData, setCanvasData, e})}
      onMouseMove={e => mouseBehaviorWrapper[mode]["move"]({width, height, canvasRef, canvasData, setCanvasData, e})}
      onMouseUp={e => mouseBehaviorWrapper[mode]["up"]({width, height, canvasRef, canvasData, setCanvasData, e})}
    ></canvas>
  );
};

export default Canvas;